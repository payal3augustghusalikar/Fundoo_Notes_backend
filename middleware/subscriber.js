const amqp = require("amqplib/callback_api");

amqp.connect(someUrl, (error, connection) => {
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
        channel.consume(queName, (msg) => {
            console.log(`Message: ${msg.content.toString()}`);
            channel.ack(msg);
            return callback(null, msg.content.toString());
        });
    });
});