# ==========================
# Stage 1: Base
# ==========================
FROM node:22-alpine AS base
WORKDIR /usr/src/app

# Install required packages
RUN apk add --no-cache python3 make g++ bash curl

# ==========================
# Stage 2: Dependencies
# ==========================
FROM base AS deps
COPY package*.json tsconfig*.json ./
RUN npm install -g npm@11.5.2
RUN npm ci

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

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install -g npm@11.5.2
RUN npm ci --omit=dev --no-optional

# Copy built files
COPY --from=build /usr/src/app/dist ./dist
COPY .env.production ./

# Set permissions
RUN chown -R appuser:appgroup /usr/src/app

USER appuser

ENV NODE_ENV=production
ENV PORT=5000
EXPOSE $PORT

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
  CMD curl -f http://localhost:$PORT/health || exit 1

CMD ["npm", "run", "start:production"]
