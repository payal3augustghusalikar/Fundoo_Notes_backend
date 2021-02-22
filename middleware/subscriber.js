const amqp = require("amqplib/callback_api");

amqp.connect(someUrl, (error, connection) => {
    if (error) {
        logger.connect("Error while connecting to Rabbit Mq");
        return callBack(error, null);
    }
    connection.createChannel((error, channel) => {
        if (error) {
            logger.error("Error while creating chnannel");
            return callBack(error, null);
        }
        let queName = "EmailIdInQueue";
        channel.assertQueue(queName, {
            durable: false,
        });
        channel.consume(queName, (msg) => {
            console.log(`Message: ${msg.content.toString()}`);
            channel.ack(msg);
            return callBack(null, msg.content.toString());
        });
    });
});