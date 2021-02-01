const User = require('../models/user.mdl.js');

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
            else
                return callback(null, data);
        });
    }



    forgotPassword = (userInfo, callback) => {
        userModel.findOne(userInfo, (error, data) => {
            if (error) {
                logger.error('Some error occurred')
                return callBack(new Error("Some error occurred"), null)
            } else if (!data) {
                logger.error('User with this email Id dosent exist')
                return callback(new Error("User with this email Id dosent exist"), null)
            } else {
                helper.nodeEmailSender(userInfo, (error, data) => {
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