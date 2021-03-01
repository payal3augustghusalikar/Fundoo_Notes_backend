const amqp = require("amqplib/callback_api");
class Publish {
    getMessage = (userInfo, callback) => {
        console.log("inside publisher");
        console.log("userInfo");
        console.log(userInfo);

        amqp.connect("amqp://localhost", (error, connection) => {
            if (error) {
                //  logger.connect("Error while connecting to Rabbit Mq");
                return callback(error, null);
            }
            connection.createChannel((error, channel) => {
                if (error) {
                    //  logger.error("Error while creating chnannel");
                    return callback(error, null);
                }
                let queueName = "EmailInQueues1";
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
    };
}

module.exports = new Publish();