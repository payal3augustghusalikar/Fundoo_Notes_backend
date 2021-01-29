const userService = require('../services/user.svc.js');
const Joi = require('joi');
const logger = require('../../logger/logger.js');
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');

const ControllerDataValidation = Joi.object().keys({
        name: Joi.string().regex(/^[a-zA-Z ]+$/).min(3).max(16).required(),
        // username: Joi.string().alphanum().min(6).max(16).required(),
        emailId: Joi.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(6).required()

    })
    // .with('name', 'emailId', 'password');


class userController {
    /**
     * @description register and save a new user
     * @param res is used to send the response
     */
    register = (req, res) => {
        const userInfo = {
            name: req.body.name,
            emailId: req.body.emailId,
            password: req.body.password
        }

        try {
            const validation = ControllerDataValidation.validate(userInfo);
            if (validation.error) {
                return res.status(400).send({
                    success: false,
                    message: "please enter valid details"
                });
            }

            userService.register(userInfo, (error, data) => {
                if (error) {
                    logger.error("Some error occurred while creating new user " + req.body.name)
                    return res.status(500).send({
                        success: false,
                        message: "Some error occurred while creating new user " + req.body.name
                    });
                }
                logger.info("user added successfully !")
                res.status(200).send({
                    success: true,
                    message: "user added successfully !",
                    data: data
                });
            });
        } catch (error) {
            logger.error("Some error occurred while creating user")
            return res.status(500).send({
                success: false,
                message: "Some error occurred while creating user"
            });
        }
    }



    /**
     * @description Find user by id
     * @method login is service class method
     * @param response is used to send the response
     */
    login = (req, res) => {
        try {
            const userLoginInfo = {
                emailId: req.body.emailId,
                password: req.body.password
            }
            userService.login(userLoginInfo, (error, data) => {
                if (error) {
                    logger.error("Error retrieving user with emailid " + req.body.emailId)
                    return res.status(500).send({
                        success: false,
                        message: "Error retrieving user with emailid " + req.body.emailId
                    });
                }
                if (!data) {
                    logger.warn("user not found with emailid: " + req.body.emailId)
                    return res.status(404).send({
                        success: false,
                        message: "user not found with emailid : " + req.body.emailId
                    });
                } else if (data.length < 1) {
                    logger.info("user not exist with emailid" + req.body.emailId);
                    return res.status(404).send({
                        success: false,
                        status_code: 404,
                        message: "Auth Failed"
                    })
                } else {
                    bcrypt.compare(req.body.password, data[0].password, function(err, result) {
                        if (err) {
                            res.status(404).send({
                                success: false,
                                message: "auth Failed"
                            });
                        }

                    })
                }
                var token = jwt.sign({
                        emailId: data[0].emailId,
                        id: data[0]._id
                    },
                    'secret', {
                        expiresIn: "1h"
                    });
                return res.status(200).send({
                    success: true,
                    message: "user found",
                    token: token
                })
            });
        } catch (error) {
            logger.error("could not found user with emailid" + req.body.emailId);
            return res.send({
                success: false,
                status_code: 500,
                message: "error retrieving user with emailid " + req.body.emailId
            })
        }
    }


    /**
     * @description Find all the user
     * @method findAll is service class method
     */
    findAll = (req, res) => {

        userService.findAll((error, data) => {
            try {
                if (error) {
                    logger.error("Some error occurred while retrieving users");
                    res.send({
                        success: false,
                        status_code: 404,
                        message: `user not found`,
                    });
                }
                logger.info("Successfully retrieved users !");
                res.send({
                    success: true,
                    status_code: 200,
                    message: `user found`,
                    data: (data)
                });
            } catch (error) {
                logger.error("user not found");
                res.send({
                    success: false,
                    status_code: 500,
                    message: `user not found`,
                });
            }
        });
    }
}

module.exports = new userController();