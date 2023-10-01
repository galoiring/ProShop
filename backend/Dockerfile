# Use an official Node.js runtime as a parent image
FROM node:16.14.2

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ../package*.json ./

# Install backend dependencies
RUN npm install

# Clean the npm cache
RUN npm cache clean --force

# Copy the rest of the backend source code
COPY . .

# Expose the port on which your backend application runs (e.g., 5000)
EXPOSE 5000

# Define the command to start your backend app (e.g., using node)
CMD ["npm", "run", "server"]
