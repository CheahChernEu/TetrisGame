# Build stage for client dependencies
FROM node:18-alpine AS client-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage for server dependencies
FROM node:18-alpine AS server-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN apk add --no-cache sqlite sqlite-dev python3 make g++ && \
    npm ci

# Final stage
FROM node:18-alpine
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache sqlite && \
    mkdir -p /app/server/data /app/node_modules/.vite-temp

# Copy dependencies
COPY --from=client-deps /app/node_modules ./node_modules
COPY --from=server-deps /app/server/node_modules ./server/node_modules

# Copy application source
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