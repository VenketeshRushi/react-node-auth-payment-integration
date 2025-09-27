# ─── Stage 1: Build Frontend ──────────────
FROM node:22-alpine AS build

# Set working directory
WORKDIR /usr/src/app/frontend

# Copy package.json and lock first for caching
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source files
COPY frontend/ ./

# Build production assets
RUN npm run build:production

# ─── Stage 2: NGINX ──────────────────────
FROM nginx:alpine

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy production build from previous stage
COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
