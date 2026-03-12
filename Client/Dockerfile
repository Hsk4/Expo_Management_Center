#Builder stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -D @tailwindcss/postcss

#Copy Everything
COPY . .

RUN npm run build

#Production stage
FROM nginx:alpine

#Copy the Final Artifact from the Production stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
#Launch these commands when container starts
CMD ["nginx", "-g", "daemon off;"]