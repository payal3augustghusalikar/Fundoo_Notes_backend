/* @module        middlewares
 * @file          user.js
 * @description  controllers takes request and send the response   
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since         26/01/2021  
-----------------------------------------------------------------------------------------------*/

const userService = require("../services/user.js");
const logger = require("../../logger/logger.js");
nodemailer = require("nodemailer");
let vallidator = require("../../middleware/vallidation.js");
const status = require("../../middleware/staticFile.json");

class userController {
    /**
     * @description register and save a new user
     * @param res is used to send the response
     */
    register = (req, res) => {
        try {
            let confirmPassword = req.body.confirmPassword;
            let password = req.body.password;
            if (password !== confirmPassword) {
                return res.send({
                    success: false,
                    status_code: status.Bad_Request,
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
                    res.send({
                        success: false,
                        status_code: status.Bad_Request,
                        message: validation.error.message,
                    }) :
                    userService.register(userInfo, (error, data) => {
                        return error ?
                            res.send({
                                success: false,
                                status_code: status.Internal_Server_Error,
                                message: error.message,
                            }) :
                            res.send({
                                status_code: status.Success,
                                message: "user added successfully please verify your mail!",
                                data: data,
                            });
                    });
            }
        } catch (error) {
            logger.error("Some error occurred while creating user");
            return res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "Some error occurred while creating user",
                error,
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
            var start = new Date();
            let confirmPassword = req.body.confirmPassword;
            let password = req.body.password;

            if (password !== confirmPassword) {
                return res.send({
                    success: false,
                    status_code: status.Bad_Request,
                    message: "Password not match",
                });
            } else {
                const userLoginInfo = {
                    emailId: req.body.emailId,
                    password: password,
                };
                userService.login(userLoginInfo, (error, data) => {
                    console.log("controller login data", data);
                    if (data.length < 1) {
                        logger.info("user not exist with emailid" + req.body.emailId);
                        return res.send({
                            success: false,
                            status_code: status.Not_Found,
                            message: "Auth Failed",
                        });
                    }
                    return res.send({
                        success: status.Success,
                        message: "login successfull",
                        token: data.token,
                    });
                });
                console.log("Request took:", new Date() - start, "ms");
            }
        } catch (error) {
            logger.error("could not found user with emailid" + req.body.emailId);
            return res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "error retrieving user with emailid " + req.body.emailId,
            });
        }
    };

    /**
     * @description takes email id and calls service class method
     * @param {*} req holds emailId
     * @param {*} res sends the responce
     */
    forgotPassword = (req, res) => {
        try {
            const userInfo = {
                emailId: req.body.emailId,
            };
            userService.forgotPassword(userInfo, (error, user) => {
                if (error) {
                    logger.error(error.message);
                    return res.send({
                        success: false,
                        status_code: status.Internal_Server_Error,
                        message: "error occured " + error.message,
                    });
                } else if (!user) {
                    logger.error("Authorization failed");
                    return res.send({
                        success: false,
                        status_code: status.Unauthorized,
                        message: "Authorization failed",
                    });
                } else {
                    logger.info("Email has been sent !");
                    return res.send({
                        success: true,
                        status_code: status.Success,
                        message: "Email has been sent !",
                    });
                }
            });
        } catch (error) {
            logger.error("Some error occurred !");
            return res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "Authorization failed  " + error.message,
            });
        }
    };

    /**
     * @description reset the user password
     * @description takes token and user data in req and calls serivce class method
     * @param {*} req new password and confirmPassword
     * @param {*} res sends the responce
     */
    resetPassword = (req, res) => {
        try {
            console.log("controller token ", helper.token);
            let newPassword = req.body.newPassword;
            let confirmPassword = req.body.confirmPassword;
            let token = req.headers.authorization.split(" ")[1];
            if (newPassword !== confirmPassword) {
                res.send({
                    success: false,
                    status_code: status.Bad_Request,
                    message: "Password not match",
                });
            } else {
                const resetPasswordData = {
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                    token: token,
                };
                validationResult = vallidator.validate(resetPasswordData.newPassword);
                return validationResult.error ?
                    res.send({
                        success: false,
                        status_code: status.Bad_Request,
                        message: validation.error.message,
                    }) :
                    userService.resetPassword(resetPasswordData, (error, data) => {
                        if (error) {
                            logger.error(error.message);
                            return res.send({
                                success: false,
                                status_code: status.Internal_Server_Error,
                                message: error.message,
                            });
                        } else if (!data) {
                            logger.error("Authorization failed");
                            return res.send({
                                success: false,
                                status_code: status.Internal_Server_Error,
                                message: "Authorization failed  " + error.message,
                            });
                        } else {
                            logger.info("Password has been changed !");
                            return res.send({
                                success: true,
                                status_code: status.Success,
                                message: "Password has been changed ",
                            });
                        }
                    });
            }
        } catch (error) {
            logger.error("Some error occurred !");
            return res.send({
                success: false,
                status_code: status.Internal_Server_Error,
                message: "Some error occurred !" + error.message,
            });
        }
    };

    /**
     * @message Update user by id
     * @method update is service class method
     * @res holds token
     * @param res is used to send the response
     */
    activateEmail = (req, res) => {
        try {
            const activateData = {
                token: req.headers.authorization.split(" ")[1],
            };
            userService
                .activate(activateData)
                .then((data) => {
                    if (!data) {
                        logger.warn("user not found with id : "),
                            res.send({
                                success: false,
                                status_code: status.Not_Found,
                                message: "user not found" + error,
                                data: data,
                            });
                    }
                    logger.info("user activated successfully !"),
                        res.send({
                            success: true,
                            status_code: status.Success,
                            message: "user activated successfully !",
                            data: data,
                        });
                })
                .catch((error) => {
                    logger.error("Error activating user "),
                        res.send({
                            success: false,
                            status_code: status.Unauthorized,
                            message: "Error activated user" + error,
                        });
                });
        } catch (error) {
            return (
                error.kind === "ObjectId" ?
                (logger.error("user not found with id "),
                    res.send({
                        success: false,
                        status_code: status.Not_Found,
                        message: "user not found " + error,
                    })) :
                logger.error("Error activated user"),
                res.send({
                    success: false,
                    status_code: status.Internal_Server_Error,
                    message: "Error activated user" + error,
                })
            );
        }
    };
}
module.exports = new userController();