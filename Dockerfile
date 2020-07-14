FROM node:lts

LABEL AL1-PROJECTS=1

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git

COPY . .

EXPOSE 3011
CMD [ "npm", "start" ]
