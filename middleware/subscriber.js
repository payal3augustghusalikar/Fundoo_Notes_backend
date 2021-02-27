const amqp = require("amqplib/callback_api");
const EventEmitter = require("events");
const event = new EventEmitter();

class Subscriber {
    // event.emit("subscribe", callback)
    //     event.on("subscribe", (error, message) => {
    //         amqp.connect("amqp://localhost", (error, connection) => {
    //             if (error) {
    //                 logger.connect("Error while connecting to Rabbit Mq");
    //                 return callback(error, null);
    //             }
    //             connection.createChannel((error, channel) => {
    //                 if (error) {
    //                     logger.error("Error while creating chnannel");
    //                     return callback(error, null);
    //                 }
    //                 let queueName = "EmailInQueues1";
    //                 channel.assertQueue(queueName, {
    //                     durable: false,
    //                 });
    //                 channel.consume(queueName, (msg) => {
    //                     console.log(`Message consumes: ${msg.content.toString()}`);
    //                     channel.ack(msg);
    //                     return callback(null, msg.content.toString());
    //                 });
    //             });
    //         });
    //     })
    consumeMessage = (callback) => {
        try {
            console.log("inside subsciriber");
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
                    let queueName = "EmailInQueues1";
                    channel.assertQueue(queueName, {
                        durable: false,
                    });
                    channel.consume(queueName, (msg) => {
                        console.log("mess");
                        console.log(`Message consumes: ${msg.content.toString()}`);
                        channel.ack(msg);
                        return callback(null, msg.content.toString());
                    });
                });
            });
        } catch (error) {
            console.log("error", error);
        }
    };
}
module.exports = new Subscriber();