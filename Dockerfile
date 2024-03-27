# Use an official Node runtime as the base image
FROM node:12.16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port 8081 available to the world outside the container
EXPOSE 8081

# Define the command to run the app
CMD ["npm", "start"]