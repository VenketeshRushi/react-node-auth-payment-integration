#!/bin/bash
set -e

echo "🚀 Running Postgres dev init script..."

# ----------------------------
# Required environment variables
# ----------------------------
: "${POSTGRES_USER:?POSTGRES_USER must be set}"
: "${DB_USER:?DB_USER must be set}"
: "${DB_PASSWORD:?DB_PASSWORD must be set}"
: "${DB_NAME:?DB_NAME must be set}"

echo "📋 Configuration:"
echo "   POSTGRES_USER: $POSTGRES_USER"
echo "   DB_USER: $DB_USER"
echo "   DB_NAME: $DB_NAME"

# ----------------------------
# Create role/user if not exists
# ----------------------------
echo "👤 Creating/updating role: $DB_USER..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';
      RAISE NOTICE '✅ Role $DB_USER created.';
   ELSE
      ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASSWORD';
      RAISE NOTICE '✅ Role $DB_USER already exists, password updated.';
   END IF;
END
\$\$;
EOSQL

# ----------------------------
# Create database if not exists
# ----------------------------
echo "🗄️  Creating database: $DB_NAME..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
EOSQL

# ----------------------------
# Grant privileges
# ----------------------------
echo "🔐 Granting privileges..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
-- Allow user to connect
GRANT CONNECT ON DATABASE $DB_NAME TO $DB_USER;
EOSQL

# ----------------------------
# Enable useful extensions
# ----------------------------
echo "🔌 Installing extensions..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Useful for timestamps
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Log enabled extensions
SELECT extname, extversion FROM pg_extension WHERE extname IN ('uuid-ossp', 'pgcrypto', 'btree_gist');
EOSQL

# ----------------------------
# Set default privileges
# ----------------------------
echo "🔧 Setting default privileges..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
-- Grant privileges on existing schema
GRANT USAGE, CREATE ON SCHEMA public TO $DB_USER;

-- Grant privileges on existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public
   GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
   GRANT ALL ON SEQUENCES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
   GRANT EXECUTE ON FUNCTIONS TO $DB_USER;
EOSQL

# ----------------------------
# Create helper functions (optional)
# ----------------------------
echo "⚙️  Creating helper functions..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
-- Function to update 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS \$\$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;

-- Example: Create a metadata table
CREATE TABLE IF NOT EXISTS _db_metadata (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert init timestamp
INSERT INTO _db_metadata (key, value)
VALUES ('initialized_at', NOW()::TEXT)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Grant access to metadata table
GRANT ALL ON TABLE _db_metadata TO $DB_USER;
EOSQL

# ----------------------------
# Display summary
# ----------------------------
echo ""
echo "✅ Postgres dev init script completed successfully!"
echo ""
echo "📊 Database Summary:"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
SELECT 
    'Database: ' || current_database() as info
UNION ALL
SELECT 
    'User: $DB_USER'
UNION ALL
SELECT 
    'Extensions: ' || string_agg(extname, ', ')
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pgcrypto', 'btree_gist');
EOSQL

echo ""
echo "🎉 Ready to use!"