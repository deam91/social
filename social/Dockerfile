FROM node:20

RUN apt-get update && apt-get install -y postgresql-client

RUN npm install -g typeorm ts-node @nestjs/cli

WORKDIR /app

COPY package*.json ./
COPY . /app

RUN npm config set registry https://registry.npmjs.org/
RUN npm install

COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
