# Build stage for dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install SQLite dependencies
RUN apk add --no-cache sqlite

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci
WORKDIR /app/server
RUN npm ci
WORKDIR /app

# Build stage for the application
FROM node:18-alpine AS builder
WORKDIR /app

# Install SQLite
RUN apk add --no-cache sqlite

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy source code
COPY . .

# Create required directories and set permissions
RUN mkdir -p /app/server/data /app/node_modules/.vite-temp && \
    chown -R node:node /app && \
    chmod -R 755 /app/node_modules/.vite-temp

# Switch to node user
USER node

# Set environment variables for file watching
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Expose ports
EXPOSE 5173
EXPOSE 3003

# Default command (will be overridden by docker-compose)
CMD ["npm", "run", "dev"]