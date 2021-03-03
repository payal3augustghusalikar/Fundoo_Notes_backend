/**
 * @module       Middleware
 * @file         subscriber.js
 * @description  holds the consumeMessage methods calling from service class
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const amqp = require("amqplib/callback_api");
const EventEmitter = require("events");
const event = new EventEmitter();
var ee = require("event-emitter");

class Subscriber {
    consumeMessage = (callback) => {
        try {
            console.log("inside subsciriber");
            amqp.connect("amqp://localhost", (error, connection) => {
                if (error) {
                    return callback(error, null);
                }
                connection.createChannel((error, channel) => {
                    if (error) {
                        return callback(error, null);
                    }
                    let queueName = "getEmail";
                    channel.assertQueue(queueName, {
                        durable: false,
                    });
                    channel.consume(queueName, (msg) => {
                        console.log(`Message consumes: ${msg.content.toString()}`);
                        //  channel.ack(msg);
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