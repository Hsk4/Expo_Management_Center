#Builder stage
FROM node:20-alpine AS build

#Working directory inside the image 
WORKDIR /app

COPY package*.json ./

#Execute commands to build your image (example install software)
RUN npm install

RUN npm install -D @tailwindcss/postcss
#Copy Everything 
COPY . .

RUN npm run build

#Production stage
FROM nginx:alpine

#Copy the Final Artifact from Builder Stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]