# specify node version 12 and above
FROM node:12

# Create app directory inside container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are grabbed
COPY package*.json ./

# build .dist/
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000
CMD [ "node", "./dist/server.js" ]