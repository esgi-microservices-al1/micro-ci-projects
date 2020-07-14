'use strict';
const amqp = require('amqplib/callback_api');
const ProjectController = require('../controllers').ProjectController;

exports.consumeSchedulerQueue = (queueName) => {
    // Create Channel
    amqp.connect(process.env.AMQP_URL, (error, connect) => {
        if (error) {
            console.log("\nAMQ connecting failed on scheduler\n");
            throw error;
        }
        connect.createChannel((err, channel) => {
            if (err) {
                console.log("\nAMQ channel failed on scheduler\n");
                throw err;
            }
            console.log("\nQueue passed on scheduler\n");
            // Assert Queue
            channel.assertQueue(queueName);

            // Receive Messages
            channel.consume(queueName, (msg) => {
                const input = JSON.parse(msg.content.toString());
                console.log(`[x] Received ${JSON.stringify(input)}`);
                channel.ack(msg);
            });
        });
    });
}

exports.consumeWebHookQueue = (queueName) => {
    amqp.connect(process.env.AMQP_URL, (error, connect) => {
        if (error) {
            console.log("\nAMQ connecting failed  on webhook\n");
            throw error;
        }
        connect.createChannel((err, channel) => {
            if (err) {
                console.log("WebHook consume error");
                throw err;
            }
            channel.assertQueue(queueName);
            console.log("\nAMQ Queue passed on webhook\n");

            channel.consume(queueName, async (msg) => {
                const input = msg.content;
                await ProjectController.webHookProcess(input);
                console.log(`[x] Received ${input}`);
                channel.ack(msg);
            })
        });
    })
}