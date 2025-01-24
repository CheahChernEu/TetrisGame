FROM node:18-alpine

# Set working directory
WORKDIR /app

# Increase system file watch limit
RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf

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