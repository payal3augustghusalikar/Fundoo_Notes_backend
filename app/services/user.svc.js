const User = require('../models/user.mdl.js');
var helper = require("../../middleware/helper.js");
const bcrypt = require("bcrypt");
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
            //    var token = helper.createToken(data);

            if (error)
                return callback(error, null);
            else if (data) {
                //  data = JSON.parse(data)
                // const token = util.generateToken(data)
                const token = helper.createToken(data);
                data.token = token
                    //  return callBack(null, data)
            } else {
                bcrypt.compare(
                    userLoginInfo.password,
                    data[0].password,
                    function(err, result) {
                        (err) ?
                        res.status(404).send({
                                success: false,
                                message: "auth Failed",
                            }):
                            //     console.log(result)
                            // console.log(userLoginInfo.password)
                            // console.log(data[0].password)
                            token = helper.createToken(data);
                        data.token = token
                            // console.log(data[0])
                            // console.log(token)
                    }
                );
            }

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