/**
 * @module        middlewares
 * @file          user.controller.js
 * @description  controllers takes request and send the response   
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since         26/01/2021  
-----------------------------------------------------------------------------------------------*/
const userService = require("../services/user.svc.js");
const logger = require("../../logger/logger.js");
const bcrypt = require("bcrypt");
var helper = require("../../middleware/helper.js");
nodemailer = require("nodemailer");
var vallidator = require("../../middleware/vallidation.js");
class userController {
    /**
     * @description register and save a new user
     * @param res is used to send the response
     */
    register = (req, res) => {
        try {
            var confirmPassword = req.body.confirmPassword;
            var password = req.body.password;
            if (password !== confirmPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Password not match",
                });
            } else {
                const userInfo = {
                    name: req.body.name,
                    emailId: req.body.emailId,
                    password: password,
                };
                const validation = vallidator.validate(userInfo);
                return validation.error ?
                    res.status(400).send({
                        success: false,
                        message: validation.error.message,
                    }) :
                    userService.register(userInfo, (error, data) => {
                        return error ?
                            res.status(500).send({
                                success: false,
                                message: error.message,
                            }) :
                            res.status(200).send({
                                success: true,
                                message: "user added successfully !",
                                data: data,
                            });
                    });
            }
        } catch (error) {
            logger.error("Some error occurred while creating user");
            return res.status(500).send({
                success: false,
                message: error.message,
            });
        }
    };
    /**
     * @description Find user by id
     * @method login is service class method
     * @param response is used to send the response
     */
    login = (req, res) => {
        try {
            var confirmPassword = req.body.confirmPassword;
            var password = req.body.password;

            if (password !== confirmPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Password not match",
                });
            } else {
                const userLoginInfo = {
                    emailId: req.body.emailId,
                    password: password,
                    // confirmPassword: confirmPassword
                };
                userService.login(userLoginInfo, (error, data) => {
                    if (data.length < 1) {
                        logger.info("user not exist with emailid" + req.body.emailId);
                        return res.status(404).send({
                            success: false,
                            status_code: 404,
                            message: "Auth Failed",
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: "login successfull",
                        token: data.token,
                    });
                });
            }
        } catch (error) {
            logger.error("could not found user with emailid" + req.body.emailId);
            return res.send({
                success: false,
                status_code: 500,
                message: "error retrieving user with emailid " + req.body.emailId,
            });
        }
    };

    forgotPassword = (req, res) => {
        try {
            const userInfo = {
                emailId: req.body.emailId,
            };
            // const validationResult = emailIdPattern.validate(userInfo.emailId);
            // if (validationResult.error) {
            //     logger.error(error.message);
            //     return res.status(400).send({
            //         success: false,
            //         message: "please Enter correct email id, " + error.message,
            //     });
            // }
            userService.forgotPassword(userInfo, (error, user) => {
                if (error) {
                    logger.error(error.message);
                    return res.status(500).send({
                        success: false,
                        message: "error occured " + error.message,
                    });
                } else if (!user) {
                    logger.error("Authorization failed");
                    return res.status(401).send({
                        success: false,
                        message: "Authorization failed",
                    });
                } else {
                    logger.info("Email has been sent !");
                    return res.status(200).send({
                        success: true,
                        message: "Email has been sent !",
                    });
                }
            });
        } catch (error) {
            logger.error("Some error occurred !");
            return res.status(500).send({
                success: false,
                message: "Authorization failed  " + error.message,
            });
        }
    };
}
module.exports = new userController();