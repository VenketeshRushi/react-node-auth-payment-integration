# ==========================
# Stage 1: Build
# ==========================
FROM node:22-alpine AS build
WORKDIR /usr/src/app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy all source code and build
COPY frontend/ ./
RUN npm run build:production

# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx html content
RUN rm -rf ./*

# Copy production build from previous stage
COPY --from=build /usr/src/app/frontend/dist .

# Copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
