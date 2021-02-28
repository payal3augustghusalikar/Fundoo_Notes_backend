/**
 * @module       services
 * @file         user.js
 * @description  holds the methods calling from controller
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const User = require("../models/user.js");
const helper = require("../../middleware/helper.js");
const bcrypt = require("bcrypt");
const logger = require("../../../logger/logger.js");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient();
const redisCache = require("../../middleware/redisCache.js");
const consume = require("../../middleware/subscriber.js");
const publish = require("../../middleware/publisher.js");
//const EventEmitter = require("events");
// const event = new EventEmitter();
// var ee = require("event-emitter");

const EventEmitter = require("events");

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

class userService {
    /**
     * @description register and save User then send response to controller
     * @method register is used to save the User
     * @param callback is the callback for controller
     */
    register = (userInfo, callback) => {
        User.save(userInfo, (error, data) => {
            if (error) return callback(error, null);
            return callback(null, data);
        });
    };

    /**
     * @description takes userInfo and calls model class method
     * @param {*} userLoginInfo
     * @param {*} callback is the callback for controller
     */
    login = (userLoginData, callback) => {
        const userEmail = userLoginData.emailId;
        const key = "login";
        redisCache.redisGet(userEmail, key, (error, data) => {
            if (data) {
                const token = helper.createToken(data[0]);
                data.token = token;
                return callback(null, data);
            } else if (!data) {
                User.find(userLoginData, (error, data) => {
                    if (error) {
                        logger.error("ERR:500-Some error occured while logging in");
                        return callback(
                            new Error("ERR:500-Some error occured while logging in"),
                            null
                        );
                    } else if (data) {
                        bcrypt.compare(
                            userLoginData.password,
                            data[0].password,
                            (error, result) => {
                                if (result) {
                                    logger.info("Authorization success");

                                    const token = helper.createToken(data[0]);
                                    data.token = token;

                                    redisCache.setRedis(data, userEmail, key);

                                    return callback(null, data);
                                } else {
                                    logger.info("ERR:401-Please verify email before login");
                                    return callback(
                                        new Error("ERR:401-Please verify email before login"),
                                        null
                                    );
                                }
                            }
                        );
                    }
                });
            }
        });
    };
    /**
     * @description Update greeting by id and return response to controller
     * @param {*} userInfo
     * @param {*} callback
     */
    forgotPassword = (userInfo, callback) => {
        User.findOne(userInfo, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else if (!data) {
                logger.error("User with this email Id dosent exist");
                return callback(
                    new Error("User with this email Id dosent exist"),
                    null
                );
            } else {
                const token = helper.createToken(data);
                userInfo.token = token;

                // console.log(token);
                // event.emit("publish", userInfo);
                publish.getMessage(userInfo, callback);

                //  event.emit("publish", userInfo);
                //  consume.consumeMessage(userInfo, callback);
                consume.consumeMessage((error, message) => {
                    if (error)
                        callBack(
                            new Error("Some error occurred while consuming message"),
                            null
                        );
                    else {
                        console.log("userInfo ", userInfo);
                        console.log("message ", message);
                        userInfo.emailId = message;
                        //     }
                        // });
                        const subject = "Reset Password";
                        helper.emailSender(userInfo, subject, (error, data) => {
                            console.log("userInfo" + userInfo);
                            if (error) {
                                logger.error("Some error occurred while sending email");
                                return callback(
                                    new Error("Some error occurred while sending email"),
                                    null
                                );
                            }
                            return callback(null, data);
                        });
                    }
                });
            }
        });
    };

    // forgotPassword = (userInfo, callback) => {
    //     User.findOne(userInfo, (error, data) => {
    //         if (error) {
    //             logger.error("Some error occurred");
    //             return callback(new Error("Some error occurred"), null);
    //         } else if (!data) {
    //             logger.error("User with this email Id dosent exist");
    //             return callback(
    //                 new Error("User with this email Id dosent exist"),
    //                 null
    //             );
    //         } else {
    //             const token = helper.createToken(data);
    //             userInfo.token = token;
    //             console.log("userInfo");
    //             console.log(userInfo);
    //             // // event.emit("publish", userInfo);
    //             // publish.getMessage(userInfo, callback);

    //             // //  event.emit("publish", userInfo);
    //             // //  consume.consumeMessage(userInfo, callback);

    //             // event.on(
    //             //     "QueueEvent",
    //             //     publish.getMessage.bind(null, (userInfo, callback))
    //             // );

    //             // event.on(
    //             //     "QueueEvent",
    //             //     consume.consumeMessage.bind(null, (error, message) => {

    //             myEmitter.emit("event1", userInfo, callback);
    //             myEmitter.emit("event2", callback);

    //             if (error)
    //                 callBack(
    //                     new Error("Some error occurred while consuming message"),
    //                     null
    //                 );
    //             else {
    //                 console.log("userInfo ", userInfo);
    //                 console.log("message ", message);
    //                 userInfo.emailId = message;
    //                 //     }
    //                 // });
    //                 const subject = "Reset Password";
    //                 helper.emailSender(userInfo, subject, (error, data) => {
    //                     console.log("userInfo" + userInfo);
    //                     if (error) {
    //                         logger.error("Some error occurred while sending email");
    //                         return callback(
    //                             new Error("Some error occurred while sending email"),
    //                             null
    //                         );
    //                     }
    //                     return callback(null, data);
    //                 });
    //             }

    //             //event.emit("QueueEvent");
    //         }
    //     });
    // };

    /**
     * @description Update user and return response to controller
     * @param {*} userInfo
     * @param {*} callback
     */
    resetPassword = (userInfo, callback) => {
        let decode = jwt.verify(userInfo.token, process.env.SECRET_KEY);
        let userId = decode.id;
        userInfo.userId = userId;
        User.update(userInfo, (error, data) => {
            if (error) return callback(error, null);
            else return callback(null, data);
        });
    };

    findOneEmail = (userInfo, callback) => {
        // const message = publish.getMessage(userInfo, callback);
        //     return User.findOne(userInfo, (error, data) => {
        //         if (error) {
        //             logger.error("Some error occurred");
        //             return callback(new Error("Some error occurred"), null);
        //         } else if (!data) {
        //             return callback(new Error("Some error occurred"), null);
        //         } else {
        //             console.log("user found");
        //             console.log("service ", data);
        //             const token = helper.createToken(data);
        //             userInfo.token = token;
        //             console.log(token);

        //             publish.getMessage(userInfo, callback);
        //             consume.consumeMessage((error, message) => {
        //                 if (error)
        //                     callBack(
        //                         new Error("Some error occurred while consuming message"),
        //                         null
        //                     );
        //                 else {
        //                     console.log("userInfo ", userInfo);
        //                     console.log("message ", message);
        //                     userInfo.emailId = message;

        //                     const subject = "verify your EmailId";
        //                     helper.emailSender(userInfo, subject, (error, data) => {
        //                         console.log("userInfo" + userInfo);
        //                         if (error) {
        //                             logger.error("Some error occurred while sending email");
        //                             return callback(
        //                                 new Error("Some error occurred while sending email"),
        //                                 null
        //                             );
        //                         }
        //                         console.log("service mail data ", data);
        //                         return callback(null, data);
        //                     });
        //                     //return callback(null, data);
        //                 }
        //             });
        //             console.log("servic data ", data);
        //             // return callback(null, data);
        //         }
        //     });
        // };

        return User.findOne(userInfo, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else if (!data) {
                logger.error("User with this email Id dosent exist");
                return callback(
                    new Error("User with this email Id dosent exist"),
                    null
                );
            } else {
                const token = helper.createToken(data);
                userInfo.token = token;

                // console.log(token);
                // event.emit("publish", userInfo);
                publish.getMessage(userInfo, callback);

                //  event.emit("publish", userInfo);
                //  consume.consumeMessage(userInfo, callback);
                return consume.consumeMessage((error, message) => {
                    if (error)
                        callBack(
                            new Error("Some error occurred while consuming message"),
                            null
                        );
                    else {
                        console.log("userInfo ", userInfo);
                        console.log("message ", message);
                        userInfo.emailId = message;
                        //     }
                        // });
                        const subject = "Reset Password";
                        return helper.emailSender(userInfo, subject, (error, data) => {
                            console.log("userInfo" + userInfo);
                            if (error) {
                                logger.error("Some error occurred while sending email");
                                return callback(
                                    new Error("Some error occurred while sending email"),
                                    null
                                );
                            }
                            return callback(null, data);
                        });
                    }
                });
            }
        });
    };

    // /**
    //  * @description Find Label by id and return response to controller
    //  * @method findOne is used to retrieve Label by ID
    //  * @param callback is the callback for controller
    //  */
    // findOneEmail = (userInfo) => {
    //     User.findOneUser(userInfo)
    //         .then((data) => {
    //             // !data
    //             //     ?
    //             //     logger.warn("user not found with id : " + userInfo.emailId) // res.send({
    //             //     : ()
    //             //     logger.info("user found with id " + userInfo.emailId),
    //             //     logger.info("user found");
    //             console.log("user found");
    //             const token = helper.createToken(data);
    //             userInfo.token = token;
    //             console.log(token);
    //             publish.getMessage(userInfo);
    //             consume
    //                 .consumeMessage()
    //                 .then((message) => {
    //                     console.log("userInfo ", userInfo),
    //                         console.log("message ", message),
    //                         (userInfo.emailId = message),
    //                         (subject = "verify your EmailId"),
    //                         helper
    //                         .emailSender(userInfo, subject)
    //                         .then((data) => {
    //                             data
    //                                 ?
    //                                 (console.log("userInfo" + userInfo), data) :
    //                                 logger.error("Some error occurred while sending email");
    //                         })
    //                         .catch((error) => {
    //                             logger.error("Error while sending email " + userInfo.emailId),
    //                                 error;
    //                         });
    //                 })
    //                 .catch((error) => {
    //                     logger.error("Error consuming message" + userInfo.emailId), error;
    //                 });
    //         })
    //         .catch((error) => {
    //             logger.error("Error retrieving user with id " + userInfo.emailId),
    //                 error;
    //         });
    // };

    // /**
    //  * @description Find Label by id and return response to controller
    //  * @method findOne is used to retrieve Label by ID
    //  * @param callback is the callback for controller
    //  */
    // findOneEmail = (userInfo) => {
    //     return User.findOneUser(userInfo)
    //         .then((data) => {
    //             // !data
    //             //     ?
    //             //     logger.warn("user not found with id : " + userInfo.emailId) // res.send({
    //             //     : ()
    //             //     logger.info("user found with id " + userInfo.emailId),
    //             //     logger.info("user found");
    //             console.log("user found");
    //             console.log(data);
    //             const token = helper.createToken(data);
    //             userInfo.token = token;
    //             console.log(token);
    //             //  publish.getMessage(userInfo);
    //             //    consume
    //             //     .consumeMessage()
    //             //     .then((message) => {
    //             console.log("userInfo ", userInfo),
    //                 // console.log("message ", message),
    //                 //  (userInfo.emailId = message),
    //                 console.log("verify");
    //             (subject = "verify your EmailId"),
    //             helper.emailSender(userInfo, subject, (error, data) => {
    //                 console.log("userInfo" + userInfo);
    //                 if (error) {
    //                     logger.error("Some error occurred while sending email");
    //                     return callback(
    //                         new Error("Some error occurred while sending email"),
    //                         null
    //                     );
    //                 }
    //                 return data;
    //             });
    //             // .emailSender(userInfo, subject)
    //             // .then((data) => {
    //             //     data
    //             //         ?
    //             //         (console.log("userInfo" + userInfo), data) :
    //             //         logger.error("Some error occurred while sending email");
    //             // })
    //             // .catch((error) => {
    //             //     logger.error("Error while sending email " + userInfo.emailId),
    //             //         error;
    //             // });
    //             //  })
    //             //  .catch((error) => {
    //             //        logger.error("Error consuming message" + userInfo.emailId), error;
    //             //   });
    //         })
    //         .catch((error) => {
    //             logger.error("Error retrieving user with id " + userInfo.emailId),
    //                 error;
    //         });
    // };

    // findOneEmail = async(userInfo) => {
    //     // const message = publish.getMessage(userInfo, callback);
    //     const data = await User.findOneUser(userInfo)
    //         // if (error) {
    //         //     logger.error("Some error occurred");
    //         //     return callback(new Error("Some error occurred"), null);
    //         // } else if (!data) {
    //         //     return callback(new Error("Some error occurred"), null);
    //         // } else {
    //     data.then(
    //         console.log("user found"); console.log(data);
    //         const token = await helper.createToken(data); userInfo.token = token; console.log(token);

    //         const publish1 = await publish.getMessage(userInfo, callback);
    //         const consume1 = await consume.consumeMessage(callback); console.log("consume1 ", consume1); console.log("userInfo ", userInfo); console.log("message ", message); userInfo.emailId = message;

    //         const subject = "verify your EmailId"; helper.emailSender(userInfo, subject, callback);
    //         return data;
    //     )
    // };

    /**
     * @description Update Label by id and return response to controller
     * @method update is used to update Label by ID
     * @param callback is the callback for controller
     */
    activate = async(activateData, callback) => {
        const decode = await jwt.verify(activateData.token, process.env.SECRET_KEY);
        let userId = decode.id;
        console.log("id ", userId);
        activateData.userId = userId;
        return User.activateOne(activateData, callback);
    };
}

module.exports = new userService();