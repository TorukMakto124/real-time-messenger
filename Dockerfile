FROM node:21.7.1-alpine3.19
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE 25495
CMD ["npm", "start"]