# ==========================
# Stage 1: Build frontend
# ==========================
FROM node:22-alpine AS build
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . ./

# Build production frontend
RUN npm run build:production

# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:alpine
# Remove default html
RUN rm -rf /usr/share/nginx/html/*

# Copy build from previous stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy nginx config (must exist in frontend folder)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
