# OpenVenture Clean Room Testing Dockerfile
# This ensures the project builds from scratch without any cached dependencies

FROM node:20-slim

# Set working directory
WORKDIR /app

# Install git (needed for some npm packages)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Copy venture config (if not already present)
COPY venture.config.json ./

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
