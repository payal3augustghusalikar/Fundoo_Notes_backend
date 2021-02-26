const amqp = require("amqplib/callback_api");

class Publish {
    getMessage = (userInfo, callback) => {
        amqp.connect("amqp://localhost", (error, connection) => {
            if (error) {
                //  logger.connect("Error while connecting to Rabbit Mq");
                callback(error, null);
            }
            connection.createChannel((error, channel) => {
                if (error) {
                    logger.error("Error while creating chnannel");
                    callback(error, null);
                }
                let queueName = "EmailIdInQueue";
                let message = userInfo.emailId;
                channel.assertQueue(queueName, {
                    durable: false,
                });
                channel.sendToQueue(queueName, Buffer.from(message));
                console.log(`Message sends to queue : ${message}`);
                setTimeout(() => {
                    connection.close();
                }, 1000);
            });
        });
        //  return message;
    };
}

module.exports = new Publish();