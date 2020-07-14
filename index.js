'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const RouterBuilder = require('./routes');
const ConsumerService = require('./service/consumer.service');
const consul = require('./consul/consul');

dotenv.config();

// //add Rabbitmq Consume Queue Service
const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Add MongoDB connection
mongoose
    .connect(process.env.DB_CONNECT,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    .then(() => console.log("Connected to database!"))
    .catch(() => console.error("Database connection failed!"));

RouterBuilder.build(app)

<<<<<<< HEAD
// try {
//     console.log("\nTrying to consume\n");
//     ConsumerService.consumeWebHookQueue(process.env.AMQP_WEBHOOK_QUEUE_NAME);
//     ConsumerService.consumeSchedulerQueue(process.env.AMQP_SCHEDULER_QUEUE_NAME);
// } catch (ex) {
//     console.log('Consumer Error');
//     console.log(ex);
// }
=======
try {
    console.log("\nTrying to consume\n");
    ConsumerService.consumeWebHookQueue(process.env.AMQP_WEBHOOK_QUEUE_NAME);
    ConsumerService.consumeSchedulerQueue(process.env.AMQP_SCHEDULER_QUEUE_NAME);
} catch (ex) {
    console.log("\nConsume error\n");
    console.log(ex);
}
>>>>>>> 038286bc6ea2417ebb725904e494ee82cce6c039

consul.register();

app.listen(port, () => console.log(`Server started on ${port}...`));
