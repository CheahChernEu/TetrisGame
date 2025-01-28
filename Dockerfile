FROM node:18-alpine

# Install SQLite dependencies
RUN apk add --no-cache sqlite

# Set working directory
WORKDIR /app

# Set environment variables for file watching
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci
RUN cd server && npm ci

# Copy source code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /app/server/data

# Expose development and API ports
EXPOSE 5173
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]