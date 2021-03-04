// /**
//  * @module       Middleware
//  * @file         subscriber.js
//  * @description  holds the consumeMessage methods calling from service class
//  * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
// *  @since        27/01/2021
// -----------------------------------------------------------------------------------------------*/

// const amqp = require("amqplib/callback_api");
// const EventEmitter = require("events");
// const event = new EventEmitter();
// var ee = require("event-emitter");
// const helper = require("../middleware/helper.js");

// class Subscriber {
//     consumeMessage = (mailData, callback) => {
//         try {
//             console.log("inside subsciriber");
//             amqp.connect("amqp://localhost", (error, connection) => {
//                 if (error) {
//                     return callback(error, null);
//                 }
//                 console.log("inside subsciriber1");
//                 connection.createChannel((error, channel) => {
//                     if (error) {
//                         return callback(error, null);
//                     }
//                     let queueName = "getEmail";
//                     channel.assertQueue(queueName, {
//                         durable: false,
//                     });
//                     console.log("inside subsciriber2");
//                     channel.consume(queueName, (msg) => {
//                         //const message = msg.content.toString();
//                         //  console.log("email ", message);
//                         console.log("inside subsciriber3");
//                         console.log(`Message consumes: ${msg.content.toString()}`);
//                         // const mailData = {
//                         //     subject: "Reset Password",
//                         //     endPoint: "resetpassword",
//                         // };
//                         console.log("inside subsciriber4");
//                         helper.emailSender(message, mailData, (error, data) => {
//                             if (error) {
//                                 logger.error("Some error occurred while sending email");
//                                 return callback(
//                                     new Error("Some error occurred while sending email"),
//                                     null
//                                 );
//                             }
//                             return callback(null, data);
//                         });
//                         channel.ack(msg);
//                         return callback(null, msg.content.toString());
//                     });
//                 });
//             });
//         } catch (error) {
//             console.log("error", error);
//         }
//     };
// }
// module.exports = new Subscriber();

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
const helper = require("../middleware/helper.js");

class Subscriber {
    consumeMessage = (token, maildata, callback) => {
        try {
            console.log("inside subsciriber");
            amqp.connect("amqp://localhost", (error, connection) => {
                if (error) {
                    return callback(error, null);
                }
                console.log("inside subsciriber0");
                connection.createChannel((error, channel) => {
                    if (error) {
                        return callback(error, null);
                    }
                    console.log("inside subsciriber1");
                    let queueName = "EmailInQueues1";
                    channel.assertQueue(queueName, {
                        durable: false,
                    });
                    console.log("inside subsciriber2");
                    channel.consume(queueName, (msg) => {
                        console.log("mess");
                        console.log(`Message consumes: ${msg.content.toString()}`);
                        const message = `${msg.content.toString()}`;
                        console.log("mess ", message);
                        // const token = helper.createToken(data);
                        // userInfo.token = token;
                        const userInfo = {
                            token: token,
                            emailId: message,
                        };
                        console.log("maildata ", maildata);
                        // helper.emailSender(userInfo, maildata, (error, data) => {
                        //     if (error) {
                        //         //   logger.error("Some error occurred while sending email");
                        //         return callback(
                        //             new Error("Some error occurred while sending email"),
                        //             null
                        //         );
                        //     }
                        //     return callback(null, data);
                        // });
                        channel.ack(msg);
                        helper.emailSender(userInfo, maildata, (error, data) => {
                            if (error) {
                                //   logger.error("Some error occurred while sending email");
                                return callback(
                                    new Error("Some error occurred while sending email"),
                                    null
                                );
                            }
                            return callback(null, data);
                        });
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