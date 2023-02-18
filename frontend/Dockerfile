FROM node:18.13.0-alpine

ARG API_KEY
ENV API_KEY=$API_KEY

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]