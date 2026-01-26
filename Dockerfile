# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Install any required global tools if needed
# RUN npm install -g pm2 (optional for production)

# Expose the port your server runs on
EXPOSE 4000

# Start the server
CMD ["npm", "start"]