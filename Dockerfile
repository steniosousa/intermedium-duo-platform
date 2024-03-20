FROM node:16

WORKDIR /src/index.js

COPY package.json ./

RUN npm i

COPY . .

CMD ["npm", "start"]
