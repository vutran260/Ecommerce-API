# Here we are getting our node as Base image
FROM node:21.7.3-alpine3.19

# Temporarily switch to root to install system packages
USER root

# Install Chromium and any other dependencies
RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont\
    font-noto-cjk

# create user in the docker image
USER node

# Creating a new directory for app files and setting path in the container
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

# setting working directory in the container
WORKDIR /home/node/app

# grant permission of node project directory to node user
COPY --chown=node:node . .

# installing the dependencies into the container
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

# Install dependencies
RUN npm install --verbose --network-timeout=200000

# container exposed network port number
EXPOSE 3000

# command to run within the container
CMD [ "npm", "start" ]