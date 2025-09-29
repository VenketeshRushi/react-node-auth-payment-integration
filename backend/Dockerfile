# ========================
# Stage 1: Base
# ========================
FROM node:22-alpine AS base
WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++ bash curl

# ========================
# Stage 2: Dependencies
# ========================
FROM base AS deps

# Copy package files first to leverage caching
COPY package*.json tsconfig*.json ./

# Install specific npm version
RUN npm install -g npm@11.5.2

# Install all dependencies (dev dependencies included for build)
RUN npm ci

# ========================
# Stage 3: Build
# ========================
FROM deps AS build

# Copy all source files
COPY . .

# Run lint and production build
RUN npm run lint
RUN npm run build

# ========================
# Stage 4: Production
# ========================
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json and lock file
COPY package*.json ./

# Install only production dependencies
RUN npm install -g npm@11.5.2
RUN npm ci --omit=dev --no-optional

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy environment file
COPY .env.production ./

# Set permissions
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE $PORT

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start backend
CMD ["npm", "run", "start:production"]
