FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]