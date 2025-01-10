# Use Node.js as the base image
FROM --platform=linux/amd64 node:21.7.3-alpine3.19

# Temporarily switch to root to install system packages
USER root

# Install Chromium and other dependencies
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    font-noto-cjk

# Create a user and app directory
USER node
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# Set working directory
WORKDIR /home/node/app

# Copy app files
COPY --chown=node:node . .

# Configure npm and install dependencies
RUN npm config set registry https://registry.npmmirror.com/ \
    && npm config set fetch-retries 10 \
    && npm config set fetch-retry-mintimeout 60000 \
    && npm config set fetch-retry-maxtimeout 300000 \
    && npm install --no-optional --verbose

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
