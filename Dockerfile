# Stage 1: Build the React project using Node
FROM node:22-alpine AS builder


WORKDIR /app


# Copy dependency files first to leverage Docker caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project files
COPY . .

# Hardcode API base URL (instead of using ARG from Coolify)
ENV VITE_API_BASE_URL=https://hbn-be.efficientemengineering.com

# Build - Vite will now have access to VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve the static site with unprivileged Nginx
FROM nginxinc/nginx-unprivileged:mainline-alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the default port (8080) for the unprivileged Nginx image
EXPOSE 8080