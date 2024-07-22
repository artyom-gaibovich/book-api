# Используем официальный образ Node.js 20.12.2
FROM node:20.12.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "./dist/src/main.js"]
