/**
 * @module        middlewares
 * @file          user.js
 * @description   controllers takes request and send the response   
 * @author        Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since         26/01/2021  
-----------------------------------------------------------------------------------------------*/

const userService = require("../services/user.js");
const logger = require("../../logger/logger.js");
nodemailer = require("nodemailer");
let vallidator = require("../../middleware/vallidation.js");

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
            let confirmPassword = req.body.confirmPassword;
            let password = req.body.password;

            if (password !== confirmPassword) {
                return res.status(400).send({
                    success: false,
                    message: "Password not match",
                });
            } else {
                const userLoginInfo = {
                    emailId: req.body.emailId,
                    password: password,
                };
                userService.login(userLoginInfo, (error, data) => {
                    return data.length < 1 ?
                        (logger.info("user not exist with emailid" + req.body.emailId),
                            res.status(404).send({
                                success: false,
                                status_code: 404,
                                message: "Auth Failed " + error,
                            })) :
                        res.status(200).send({
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

    /**
     * @description takes email id and calls service class method
     * @param {*} req
     * @param {*} res
     */
    forgotPassword = (req, res) => {
        try {
            const userInfo = {
                emailId: req.body.emailId,
            };
            userService.forgotPassword(userInfo, (error, user) => {
                return (
                    error ?
                    (logger.error(error.message),
                        res.status(500).send({
                            success: false,
                            message: "error occured " + error.message,
                        })) :
                    !user ?
                    (logger.error("Authorization failed"),
                        res.status(401).send({
                            success: false,
                            message: "Authorization failed",
                        })) :
                    logger.info("Email has been sent !"),
                    res.status(200).send({
                        success: true,
                        message: "Email has been sent !",
                    })
                );
            });
        } catch (error) {
            logger.error("Some error occurred !");
            return res.status(500).send({
                success: false,
                message: "Authorization failed  " + error.message,
            });
        }
    };

    /**
     * @description reset the user password
     * @description takes token and user data in req and calls serivce class method
     * @param {*} req
     * @param {*} res
     */
    resetPassword = (req, res) => {
        try {
            var newPassword = req.body.newPassword;
            var confirmPassword = req.body.confirmPassword;
            var token = req.headers.authorization.split(" ")[1];
            if (newPassword !== confirmPassword) {
                res.status(400).send({
                    success: false,
                    message: "Password not match",
                });
            } else {
                const resetPasswordData = {
                    newPassword: newPassword,
                    confirmPassword: confirmPassword,
                    token: token,
                };
                userService.resetPassword(resetPasswordData, (error, data) => {
                    return (
                        error ?
                        (logger.error(error.message),
                            res.status(500).send({
                                success: false,
                                message: error.message,
                            })) :
                        !data ?
                        (logger.error("Authorization failed"),
                            res.status(500).send({
                                success: false,
                                message: "Authorization failed  ",
                            })) :
                        logger.info("Password has been changed !"),
                        res.status(200).send({
                            success: true,
                            message: "Password has been changed ",
                        })
                    );
                });
            }
        } catch (error) {
            logger.error("Some error occurred !");
            return res.status(500).send({
                success: false,
                message: "Some error occurred !" + error.message,
            });
        }
    };
}

module.exports = new userController();