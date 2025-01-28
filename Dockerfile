# Development stage for frontend
FROM node:20-alpine as frontend

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Development stage for backend
FROM node:20-alpine as backend
WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./
RUN npm install

# Create data directory with correct permissions
RUN mkdir -p /app/data && chown -R node:node /app

USER node