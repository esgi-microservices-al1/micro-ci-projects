var amqp = require('amqplib/callback_api');

class QueueManager {

  // à mettre dans un dossier de config
  queue = "queue_name_test";
  broker_adress = "amqp://localhost";  

  // Démarre l'écoute sur la queue et appelle la fonction de traitement des informations reçues
  startListener() {

    amqp.connect(this.broker_adress, function(error0, connection) {
      if (error0) {
        throw error0;
      }

      connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }

        channel.assertQueue(queue, {
          durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(message) {
        // TODO : traitement des informations reçues
        // TODO : Passage à la step suivante
          console.log("Reçu: " + message.content.toString());
        
        }, {
          noAck: true
        });
      });
    });
  }
}

