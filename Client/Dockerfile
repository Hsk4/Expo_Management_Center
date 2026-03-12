# Builder Stage
FROM node:18-alpine3.20 as build

WORKDIR /app

COPY package.json* ./

RUN npm install

COPY . .

# Production stage
FROM nginx:alpine

# COPY The final Artifact From Builder Stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx" , "-g" , "daemon off;" ]