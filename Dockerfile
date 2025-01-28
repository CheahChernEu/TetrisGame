# Build stage for frontend
FROM node:20-alpine as frontend-build

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy source files and build
COPY . .
RUN npm run build

# Production stage for frontend
FROM nginx:alpine as frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Production stage for backend
FROM node:20-alpine as backend
WORKDIR /app

# Install production dependencies only
COPY server/package*.json ./
RUN npm ci --only=production

# Copy backend source files
COPY server/ ./

# Create data directory with correct permissions
RUN mkdir -p /app/data && \
    chown -R node:node /app && \
    chmod 755 /app && \
    chmod 777 /app/data

ENV NODE_ENV=production
USER node
CMD ["npm", "start"]