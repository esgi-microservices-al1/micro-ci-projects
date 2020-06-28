'use strict';
const amqp = require('amqplib/callback_api');

exports.publishToQueue = async (queueName, data) => {

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
            channel.sendToQueue(queueName, Buffer.from(data), {persistent: true});
        });
    });
}