FROM node:16

WORKDIR /src/index

COPY . .
COPY package.json ./

RUN npm install


CMD ["npm", "start"]
