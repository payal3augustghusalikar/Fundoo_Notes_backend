const User = require('../models/user.js');
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
     * @method update is used to update greeting by ID
     * @param callBack is the callBack for controller
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
     * @method update is used to update user
     * @param callBack is the callBack for controller
     */
    resetPassword = (userInfo, callBack) => {
        console.log("service token ", token);
        User.update(userInfo, (error, data) => {
            if (error)
                return callBack(error, null);
            else
                return callBack(null, data);
        });
    }
}

module.exports = new userService();