# Dockerfile for Backend
FROM node:18-alpine3.20

WORKDIR /app

COPY Server/package*.json ./

RUN npm install

COPY Server/ .

EXPOSE 5000

CMD [ "node" , "server.js" ]