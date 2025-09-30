# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production assets
RUN npm run build:production

# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:alpine

# Remove default Nginx assets
RUN rm -rf /usr/share/nginx/html/*

# Copy React build
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
