const amqp = require("amqplib/callback_api");

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
        let message = "this is just for message";
        channel.assertQueue(queueName, {
            durable: false,
        });
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message : ${message}`);
        setTimeout(() => {
            connection.close();
        }, 1000);
    });
});