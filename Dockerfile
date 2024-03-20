FROM node:16

WORKDIR /src/index.js

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
