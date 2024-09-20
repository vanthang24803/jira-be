FROM node:20.9.0-alpine as builder

WORKDIR /app

RUN npm install -g yarn

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "yarn", "start" ]
