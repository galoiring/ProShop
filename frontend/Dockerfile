# Use an official Node.js runtime as a parent image
FROM node:16.14.2

# Set the working directory to /app/frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Clean the npm cache
RUN npm cache clean --force

# Copy the current directory contents into the container at /app/frontend
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to start your React app
CMD ["npm", "start"]
