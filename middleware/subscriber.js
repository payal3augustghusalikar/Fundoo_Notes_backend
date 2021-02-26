const amqp = require("amqplib/callback_api");

class Subscriber {
    consumeMessage = (callback) => {
        amqp.connect("amqp://localhost", (error, connection) => {
            if (error) {
                logger.connect("Error while connecting to Rabbit Mq");
                return callback(error, null);
            }
            connection.createChannel((error, channel) => {
                if (error) {
                    logger.error("Error while creating chnannel");
                    return callback(error, null);
                }
                let queueName = "EmailIdInQueue";
                channel.assertQueue(queueName, {
                    durable: false,
                });
                channel.consume(queueName, (msg) => {
                    console.log("Message queueName :", queueName);
                    console.log("Message msg :", msg);
                    console.log(`Message consumessss: ${msg.content.toString()}`);
                    //  channel.ack(msg);
                    console.log("after sending mail ", msg);
                    return callback(null, msg.content.toString());
                });
            });
        });
    };
}

module.exports = new Subscriber();