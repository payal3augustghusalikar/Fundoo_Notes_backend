/**
 * @module       services
 * @file         user.js
 * @description  holds the methods calling from controller
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const User = require('../models/user.js');
const helper = require("../../middleware/helper.js");
const bcrypt = require("bcrypt");
const logger = require('../../../logger/logger.js');
const jwt = require("jsonwebtoken");

class userService {

    /**
     * @description register and save User then send response to controller
     * @method register is used to save the User
     * @param callback is the callback for controller
     */
    register = (userInfo, callback) => {
        User.save(userInfo, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        })
    }

    /**
     * @description takes userInfo and calls model class method
     * @param {*} userLoginInfo 
     * @param {*} callback is the callback for controller
     */
    login = (userLoginInfo, callback) => {

        User.find(userLoginInfo, (error, data) => {
            if (error)
                return callback(error, null);
            else if (data) {
                const token = helper.createToken(data);
                data.token = token
            } else {
                bcrypt.compare(
                    userLoginInfo.password,
                    data.password,
                    function(err, result) {
                        (err) ?
                        res.status(404).send({
                                success: false,
                                message: "auth Failed",
                            }):
                            logger.info("token created")
                    }
                );
            }
            return callback(null, data);
        });
    }

    /**
     * @description Update greeting by id and return response to controller
     * @param {*} userInfo 
     * @param {*} callback 
     */
    forgotPassword = (userInfo, callback) => {
        User.findOne(userInfo, (error, data) => {
            if (error) {
                logger.error('Some error occurred')
                return callback(new Error("Some error occurred"), null)
            } else if (!data) {
                logger.error('User with this email Id dosent exist')
                return callback(new Error("User with this email Id dosent exist"), null)
            } else {
                const token = helper.createToken(data);
                userInfo.token = token
                console.log(token)
                helper.emailSender(userInfo, (error, data) => {
                    console.log("userInfo" + userInfo)
                    if (error) {
                        logger.error('Some error occurred while sending email')
                        return callback(new Error("Some error occurred while sending email"), null)
                    }
                    return callback(null, data)
                })
            }
        })
    }

    /**
     * @description Update user and return response to controller
     * @param {*} userInfo 
     * @param {*} callback 
     */
    resetPassword = (userInfo, callback) => {
        let decode = jwt.verify(userInfo.token, process.env.SECRET_KEY);
        let userId = decode.id
        console.log("user Id", userId)
        console.log("service token ", userInfo.token);
        userInfo.userId = userId
        console.log("id", userId)
        console.log(newPassword)
        User.update(userInfo, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }
}

module.exports = new userService();