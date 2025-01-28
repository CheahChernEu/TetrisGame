# Development stage for frontend
FROM node:20-alpine as frontend

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Development stage for backend
FROM node:20-alpine as backend
WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./
RUN npm install

# Copy backend source files
COPY server/ ./

# Create data directory with correct permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app && \
    chmod 755 /app && \
    chmod 777 /app/data

USER node