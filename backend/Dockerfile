# ==========================
# Stage 1: Base
# ==========================
FROM node:22-alpine AS base
WORKDIR /usr/src/app

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

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package.json for prod deps
COPY package*.json ./

# Install only production deps
RUN npm install -g npm@11.5.2 && npm ci --omit=dev --no-optional

# Copy built files + env
COPY --from=build /usr/src/app/dist ./dist

RUN chown -R appuser:appgroup /usr/src/app
USER appuser

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["npm", "run", "start:production"]
