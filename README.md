# Microservice: projects part

### First time you clone the project?
Please make sure to ask the .env file to another developer to have all configuration needed.
You can also ask for another developer his data folder to have the same.

### Run the project

Clone the project.
Locally:
```BASH
npm install && npm start
```
In a docker container:
```BASH
docker build -t microservice:dev .
docker run -v ${PWD}:/app -v /app/node_modules --name microservice-server -p 3000:3000 --rm microservice:dev
```

Work in Progress!
