# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:22-alpine AS build

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install -g npm@11.5.2 && npm ci

# Copy source code
COPY . .

# Build production assets
RUN npm run build:production

# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:alpine

# Install curl/wget for healthcheck
RUN apk add --no-cache curl wget

# Remove default Nginx assets
RUN rm -rf /usr/share/nginx/html/*

# Copy React build from stage 1
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx config (must be inside frontend folder)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
