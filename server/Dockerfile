FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

ENV CHOKIDAR_USEPOLLING=true
ENV NODE_OPTIONS="--max-old-space-size=4096"

CMD ["npm", "run", "dev"]