# Build stage for dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install SQLite and required build dependencies
RUN apk add --no-cache sqlite sqlite-dev python3 make g++ && \
    mkdir -p /app/server/data

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

# Install SQLite and create necessary directories
RUN apk add --no-cache sqlite && \
    mkdir -p /app/server/data /app/node_modules/.vite-temp

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/server/data ./server/data
COPY . .

# Set proper permissions
RUN chown -R node:node /app && \
    chmod -R 755 /app/node_modules/.vite-temp && \
    chmod -R 777 /app/server/data

# Switch to node user for security
USER node

# Set environment variables for file watching
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Expose ports
EXPOSE 5173
EXPOSE 3003

# Default command (will be overridden by docker-compose)
CMD ["npm", "run", "dev"]