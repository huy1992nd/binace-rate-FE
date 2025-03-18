# Use an official Node runtime as a parent image
FROM node:16 AS builder

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install the dependencies
RUN npm install

# Copy the remaining application files to the working directory
COPY . .

# Build the application
RUN npm run build

FROM nginx:alpine
# Setup auto direct luter on react
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the build folder to nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run nginx
CMD [ "nginx", "-g", "daemon off;" ]