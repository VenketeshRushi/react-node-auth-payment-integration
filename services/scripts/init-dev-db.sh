#!/bin/bash
set -e

echo "🚀 Running Postgres initialization script..."

# ----------------------------
# Use environment variables from docker-compose
# ----------------------------
POSTGRES_USER="${POSTGRES_USER}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD}"

DB_USER="${DB_USER}"
DB_PASSWORD="${DB_PASSWORD}"
DB_NAME="${DB_NAME}"

export PGPASSWORD="$POSTGRES_PASSWORD"

echo "📋 Configuration:"
echo "   POSTGRES_USER: $POSTGRES_USER"
echo "   DB_USER: $DB_USER"
echo "   DB_NAME: $DB_NAME"

# ----------------------------
# Wait for Postgres to be ready
# ----------------------------
echo "⏳ Waiting for Postgres to accept connections..."
until psql -U "$POSTGRES_USER" -d postgres -c '\q' 2>/dev/null; do
  sleep 1
done
echo "✅ Postgres is ready."

# ----------------------------
# Create or update DB_USER (WITH SUPERUSER - USE WITH CAUTION)
# ----------------------------
echo "👤 Creating/updating user: $DB_USER with SUPERUSER privileges..."
echo "⚠️  WARNING: Granting SUPERUSER privileges. This is a security risk!"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD' SUPERUSER CREATEDB CREATEROLE;
      RAISE NOTICE '✅ SUPERUSER role $DB_USER created.';
   ELSE
      ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASSWORD' SUPERUSER CREATEDB CREATEROLE;
      RAISE NOTICE '✅ SUPERUSER role $DB_USER exists, password updated.';
   END IF;
END
\$\$;
EOSQL

# ----------------------------
# Create database if not exists
# ----------------------------
echo "🗄️  Creating database: $DB_NAME..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
EOSQL

# ----------------------------
# Grant necessary privileges on the database
# ----------------------------
echo "🔐 Granting privileges on $DB_NAME to $DB_USER..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO $DB_USER;
EOSQL

# ----------------------------
# Enable useful extensions
# ----------------------------
echo "🔌 Installing extensions..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" <<-EOSQL
-- UUID generation (for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log enabled extension
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'uuid-ossp';
EOSQL



# ----------------------------
# Display summary
# ----------------------------
echo ""
echo "✅ Database initialization completed successfully!"
echo ""
echo "📊 Database Summary:"
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$DB_NAME" -t <<-EOSQL
SELECT '  Database: ' || current_database();
SELECT '  Owner: $DB_USER';
SELECT '  Extensions: uuid-ossp';
EOSQL

echo ""
echo "🎉 Ready to use! Connection string:"
echo "   postgresql://$DB_USER:****@localhost:5432/$DB_NAME"
echo ""

# ----------------------------
# Verify the user can connect
# ----------------------------
echo "🔍 Verifying user credentials..."
export PGPASSWORD="$DB_PASSWORD"
if psql -U "$DB_USER" -d "$DB_NAME" -c '\conninfo' 2>/dev/null; then
    echo "✅ User $DB_USER can connect successfully with provided password"
else
    echo "❌ WARNING: User $DB_USER cannot connect with provided password!"
    echo "   This will cause application connection failures."
fi
echo ""