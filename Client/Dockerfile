#Builder Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

#Copy Everything
COPY . .

RUN npm run build

#Production stage
FROM nginx:alpine

#Copy the Final Artifact from the Builder stage 
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

#Run this when the Container Starts
CMD ["nginx", "-g", "daemon off;"]