# Use Node.js LTS Alpine for smaller image size
FROM node:18-alpine

# Install git for the publish functionality
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy blog editor server
COPY blog-editor-server.js ./

# Copy static files needed for the editor
COPY blog-editor.html ./
COPY js/blog-editor.js ./js/
COPY css/style.css ./css/

# Create _posts directory
RUN mkdir -p _posts

# Expose the port
EXPOSE 3002

# Run the server
CMD ["node", "blog-editor-server.js"]