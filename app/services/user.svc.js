const User = require('../models/user.mdl.js');
var helper = require("../../middleware/helper.js");
const bcrypt = require("bcrypt");
const logger = require('../../../logger/logger.js');
class userService {
    /**
     * @description register and save User then send response to controller
     * @method register is used to save the User
     * @param callback is the callback for controller
     */

    register = (userInfo, callback) => {
        // register a User
        User.save(userInfo, (error, data) => {
            if (error)
                return callback(error, null);
            return callback(null, data);
        })
    }

    /**
     * @description Find User by id and return response to controller
     * @method login is used to retrieve User by ID
     * @param callback is the callback for controller
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
                    // helper.emailSender(userInfo, (error, data) => {
                    //     if (error) {
                    //         logger.error('Some error occurred while sending email')
                    //         return callback(new Error("Some error occurred while sending email"), null)
                    //     }
                    // return callback(null, data)
                    //})
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
}

module.exports = new userService();