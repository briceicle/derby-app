# base image
FROM node:10.15.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8004
CMD [ "npm", "start" ]