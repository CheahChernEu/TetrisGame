# Development stage for frontend
FROM node:20-alpine as frontend
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]

# Development stage for backend
FROM node:20-alpine as backend
WORKDIR /app

# Install all dependencies including devDependencies
COPY server/package*.json ./
RUN npm install

# Copy backend source files
COPY server/ ./

# Create data directory with correct permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app && \
    chmod 755 /app && \
    chmod 777 /app/data

# Set environment variable for database path
ENV SQLITE_DB_PATH=/app/data/tetris.db

# Initialize the database
RUN node init-db.js

EXPOSE 3003
USER node
CMD ["npm", "run", "dev"]