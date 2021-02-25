const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", (error, connection) => {
    if (error) {
        //  logger.connect("Error while connecting to Rabbit Mq");
        callBack(error, null);
    }
    connection.createChannel((error, channel) => {
        if (error) {
            logger.error("Error while creating chnannel");
            callBack(error, null);
        }
        let queName = "EmailIdInQueue";
        let message = "this is just for message";
        channel.assertQueue(queueName, {
            durable: false,
        });
        channel.sendToQueue(queName, Buffer.from(message));
        console.log(`Message : ${message}`);
        setTimeout(() => {
            connection.close();
        }, 1000);
    });
});