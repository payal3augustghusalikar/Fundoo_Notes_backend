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

class userService {
    /**
     * @description register and save User then send response to controller
     * @method register is used to save the User
     * @param callback is the callback for controller
     */
    register = (userInfo, callback) => {
        User.save(userInfo, (error, data) => {
            if (error) return callback(error, null);
            else console.log("user found");
            console.log("service ", data);
            const token = helper.createToken(data);
            userInfo.token = token;
            console.log(token);
            publish.getMessage(userInfo, callback);
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
                    const mailData = {
                        subject: "verify your EmailId",
                        endPoint: "activateemail",
                    };
                    helper.emailSender(userInfo, mailData, (error, data) => {
                        console.log("userInfo" + userInfo);
                        if (error) {
                            logger.error("Some error occurred while sending email");
                            return callback(
                                new Error("Some error occurred while sending email"),
                                null
                            );
                        }
                        console.log("service mail data ", data);
                        return callback(null, data);
                    });
                    // return callback(null, data);
                }
                return callback(null, data);
            });
            console.log("servic data ", data);
            //return callback(null, data);
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

                publish.getMessage(userInfo, callback);
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

                        const mailData = {
                            subject: "Reset Password",
                            endPoint: "resetpassword",
                        };
                        helper.emailSender(userInfo, mailData, (error, data) => {
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
        const message = publish.getMessage(userInfo, callback);
        return User.findOne(userInfo, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else if (!data) {
                return callback(new Error("Some error occurred"), null);
            } else {
                console.log("user found");
                console.log("service ", data);
                const token = helper.createToken(data);
                userInfo.token = token;
                console.log(token);

                publish.getMessage(userInfo, callback);
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

                        const subject = "verify your EmailId";
                        helper.emailSender(userInfo, subject, (error, data) => {
                            console.log("userInfo" + userInfo);
                            if (error) {
                                logger.error("Some error occurred while sending email");
                                return callback(
                                    new Error("Some error occurred while sending email"),
                                    null
                                );
                            }
                            console.log("service mail data ", data);
                            return callback(null, data);
                        });
                        // return callback(null, data);
                    }
                    return callback(null, data);
                });
                console.log("servic data ", data);
            }
        });
    };

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