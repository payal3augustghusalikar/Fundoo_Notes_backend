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
var redisCache = require("../../middleware/redisCache.js");

class userService {
    /**
     * @description register and save User then send response to controller
     * @method register is used to save the User
     * @param callback is the callback for controller
     */
    register = (userInfo, callback) => {
        User.save(userInfo, callback);
    };

    // /**
    //  * @description takes userInfo and calls model class method
    //  * @param {*} userLoginInfo
    //  * @param {*} callback is the callback for controller
    //  */
    // login = (userLoginInfo, callback) => {
    //         const userEmail = userLoginInfo.emailId;
    //         User.find(userLoginInfo, (error, data) => {
    //                     if (error) return callback(error, null);
    //                     else if (!data) {
    //                         return callback(error, null);
    //                         //  else if (data) {
    //                         // // client.setex(process.env.REDIS_KEY, 2000, JSON.stringify(data));
    //                         const token = helper.createToken(data);
    //                         data.token = token;
    //                         // const redisData = redisCache.setRedis(data, userEmail);
    //                         // console.log("setting redis data : " + redisData);
    //                     } else {
    //                         bcrypt.compare(
    //                             userLoginInfo.password,
    //                             data.password,
    //                             function(error, result) {
    //                                 return error ?
    //                                     // res.status(404).send({
    //                                     //     success: false,
    //                                     //     message: "auth Failed",
    //                                     // })
    //                                     callback(error, null) :
    //                                     (token = helper.createToken(data)),
    //                                     data.token = token,
    //                                     logger.info("token created"),
    //                                     // redisData = redisCache.setRedis(data, userEmail);
    //                                     // console.log("setting redis data : " + redisData);
    //                                     callback(null, data);
    //                             }

    //                             return callback(null, data);
    //                         };

    /**
     * @description takes userInfo and calls model class method
     * @param {*} userLoginInfo
     * @param {*} callback is the callback for controller
     */
    /**
     * @description takes userInfo and calls model class method
     * @param {*} userLoginInfo
     * @param {*} callback is the callback for controller
     */
    login = (userLoginInfo, callback) => {
        const userEmail = userLoginInfo.emailId;
        User.find(userLoginInfo, (error, data) => {
            if (error) return callback(error, null);
            else if (data) {
                const token = helper.createToken(data);
                data.token = token;
                console.log("service token : " + token);
                const redisData = redisCache.setRedis(data, userEmail);
                console.log("setting redis data : " + redisData);
                // } else {

                bcrypt.compare(
                    userLoginInfo.password,
                    data.password,
                    function(err, result) {
                        return (
                            err ?
                            (logger.info("Auth Failed", +error), callback(error, null)) :
                            logger.info("token created"),
                            callback(null, data)
                        );

                        // callback(null, data);
                    }
                );
            }
            // const redisData = redisCache.setRedis(data, userEmail);
            // console.log("setting redis data : " + redisData);
            return callback(null, data);
        });
    };
    // /**
    //  * @description Update greeting by id and return response to controller
    //  * @param {*} userInfo
    //  * @param {*} callback
    //  */
    // login = (userInfo, callback) => {
    //     User.find(userInfo, (error, data) => {
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
    //             bcrypt.compare(
    //                 userLoginInfo.password,
    //                 data.password,
    //                 function(err, result) {
    //                     return err ?
    //                         res.status(404).send({
    //                             success: false,
    //                             message: "auth Failed",
    //                         }) :
    //                         (logger.info("token created"),
    //                             (token = helper.createToken(data)),
    //                             (userInfo.token = token),
    //                             console.log(token),
    //                             callback(null, data));
    //                 }
    //             );
    //         }
    //         callback(null, data);
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
        console.log("user Id", userId);
        console.log("service token ", userInfo.token);
        userInfo.userId = userId;
        console.log("id: ", userId);
        User.update(userInfo, (error, data) => {
            if (error) return callback(error, null);
            return callback(null, data);
        });
    };
}

module.exports = new userService();