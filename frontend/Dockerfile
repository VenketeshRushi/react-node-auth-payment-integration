# ========================
# Stage 1: Build Frontend
# ========================
FROM node:22-alpine AS build

WORKDIR /usr/src/app/frontend

# Install build dependencies
RUN apk add --no-cache bash git curl

# Copy package files first for caching
COPY frontend/package*.json ./

# Install all dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build production assets
RUN npm run build:production

# ========================
# Stage 2: Nginx
# ========================
FROM nginx:alpine

# Remove default welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy production build from build stage
COPY --from=build /usr/src/app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
