FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment variables for file watching
ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose development port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev"]