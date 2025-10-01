# ==========================
# Stage 1: Build
# ==========================
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Install build dependencies
RUN apk add --no-cache python3 make g++ bash curl

# Copy package files and install dependencies
COPY package*.json tsconfig*.json ./
RUN npm ci

# Copy source code and build the application
COPY . .
RUN npm run build

# ==========================
# Stage 2: Production
# ==========================
FROM node:22-alpine AS prod

WORKDIR /usr/src/app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy only production dependencies and built files
COPY package*.json ./
RUN npm ci --omit=dev --no-optional && npm cache clean --force

COPY --from=build /usr/src/app/dist ./dist

# Set ownership and switch user
RUN chown -R appuser:appgroup /usr/src/app
USER appuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the server
CMD ["node", "./dist/server.js"]
