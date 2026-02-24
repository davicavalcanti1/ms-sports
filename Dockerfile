# Stage 1: Build the React application
FROM node:18-alpine as build

WORKDIR /app

# Add ARG for environment variables needed at build time
ARG VITE_IMAGE_BASE_URL
ARG VITE_IMAGE_PATH_PREFIX
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set them as ENV so Vite can pick them up
ENV VITE_IMAGE_BASE_URL=$VITE_IMAGE_BASE_URL
ENV VITE_IMAGE_PATH_PREFIX=$VITE_IMAGE_PATH_PREFIX
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
