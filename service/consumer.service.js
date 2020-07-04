'use strict';
const amqp = require('amqplib/callback_api');
const ProjectController = require('../controllers').ProjectController;

exports.consumeSchedulerQueue = (queueName) => {
    // Create Channel
    amqp.connect(process.env.AMQP_URL, (error, connect) => {
        if (error) {
            throw error;
        }
        connect.createChannel((err, channel) => {
            if (err) {
                throw err;
            }
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
            throw error;
        }
        connect.createChannel((err, channel) => {
            if (err) {
                throw err;
            }
            channel.assertQueue(queueName);

            channel.consume(queueName, async (msg) => {
                const input = msg.content;
                await ProjectController.webHookProcess(input);
                console.log(`[x] Received ${input}`);
                channel.ack(msg);
            })
        });
    })
}