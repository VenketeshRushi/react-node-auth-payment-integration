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
COPY package*.json tsconfig*.json ./
RUN npm install -g npm@11.5.2
# Install all dependencies (dev needed for build)
RUN npm ci
RUN npm cache clean --force

# ========================
# Stage 3: Build
# ========================
FROM deps AS build

# Copy ALL source files - this was the missing piece!
COPY . .

# Remove node_modules to avoid conflicts (will be reinstalled in prod stage)
RUN rm -rf node_modules

# Reinstall dependencies for build
RUN npm ci

# Run the build
RUN npm run lint
RUN npm run build:prod

# Debug: Show build output
RUN echo "Build complete. Contents of dist:" && ls -la dist/

# ========================
# Stage 4: Production
# ========================
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json & install only production deps
COPY package*.json ./

# Install npm globally
RUN npm install -g npm@11.5.2

# Install production dependencies
RUN npm ci --omit=dev --no-optional
RUN npm cache clean --force

# Copy built files from build stage
COPY --from=build /usr/src/app/dist ./dist

# Copy environment file (it should be available during build context)
COPY .env.prod ./

# Debug: Verify files in production stage
RUN echo "Production files:" && ls -la && echo "Dist contents:" && ls -la dist/

# Set permissions
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

# Environment
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE $PORT

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Start app
CMD ["npm", "run", "start:prod"]