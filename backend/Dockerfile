# ==========================
# Stage 1: Base
# ==========================
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash \
    curl

# ==========================
# Stage 2: Dependencies
# ==========================
FROM base AS deps
COPY package*.json ./
RUN npm install -g npm@11.5.2
RUN npm ci --only=production && \
    cp -R node_modules /tmp/prod_node_modules && \
    npm ci

# ==========================
# Stage 3: Build
# ==========================
FROM deps AS build
COPY . .
RUN npm run build

# ==========================
# Stage 4: Production
# ==========================
FROM node:22-alpine AS prod
WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install runtime dependencies only
RUN apk add --no-cache curl dumb-init

# Copy production node_modules from deps stage
COPY --from=deps /tmp/prod_node_modules ./node_modules

# Copy built application
COPY --from=build /usr/src/app/dist ./dist

# Copy package.json for version info (optional)
COPY --from=build /usr/src/app/package*.json ./

# Create logs directory with proper permissions
RUN mkdir -p logs && \
    chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV HOST=0.0.0.0

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application directly with node (faster than npm)
CMD ["node", "dist/server.js"]