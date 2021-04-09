/**
 * @module       Middleware
 * @file         helper.js
 * @description  holds the logical reusable methods calling from service class
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const jwt = require("jsonwebtoken");
const logger = require("../../logger/logger");
const nodemailer = require("nodemailer");
const express = require("express");
require("dotenv").config();
const ejs = require("ejs");
const app = express();
require("../config").set(process.env.NODE_ENV, app);
const config = require("../config").get();
//const Note = require("../models/note.js");
var redisCache = require("../middleware/redisCache.js");
//const Note = require("./../../models/note.js");
const Note = require("../app/models/note.js");

const tokenForRedis = null;
class Helper {
    /**
     * @description create the token
     * @param {} data
     */
    createToken = (data) => {
        return jwt.sign({
                emailId: data.emailId,
                id: data._id,
            },
            process.env.SECRET_KEY, {
                expiresIn: "60d",
            }
        );
    };

    /**
     * @description verify the token to authorized user
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    verifyToken = (req, res, next) => {
        try {

            // if (req.session.token) {
            let token = req.headers.authorization.split(" ")[1];
            console.log("token is  : ", token);
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            req.userData = decode;
            next();
            // } else {
            //     console.log("session not found");
            //     res.redirect("/login");
            // }
        } catch (error) {
            res.status(401).send({
                error: "unauthorized",
            });
        }
    };

    /**
     * @description verify the token to authorized user
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    verifyUser = (req, res, next) => {
        try {
            console.log("session: " + JSON.stringify(req.session));
            console.log("sessionid: " + req.session.id);
            console.log(req.session.token);

            if (req.session.token) {
                let token = req.headers.authorization.split(" ")[1];
                console.log(token);

                const decode = jwt.verify(token, process.env.SECRET_KEY);
                req.userData = decode;
                next();
            } else {
                console.log("session not found");
                res.redirect("/login");
            }
        } catch (error) {
            res.status(401).send({
                error: "unauthorized",
            });
        }
    };

    /**
     * @description decode token to get userId
     * @param {*} noteInfo
     * @param {*} token
     */
    decodeToken = (noteInfo, token) => {
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        let userId = decode.id;
        noteInfo.userId = userId;
        return noteInfo;
    };

    /**
     * @description get emial from token
     * @param {*} token
     */

    getEmailFromToken = (token) => {
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        let emailId = decode.emailId;
        return emailId;
    };


    updateRedisData(token, key) {
        try {
            console.log("key", key)

            console.log("token1 is : ", token);
            const userEmail = this.getEmailFromToken(token);
            console.log("userEmail : ", userEmail);
            return Note.findAll((error, data) => {
                if (error) {
                    logger.error("Some error occurred");
                    return callback(new Error("Some error occurred"), null);
                } else {
                    console.log("setting new data to redis", data)
                    redisCache.setRedis(data, userEmail, key);
                    // return callback(null, data);
                }
            });
        } catch (error) {
            console.log("error", error)
        } //const token = req.headers.authorization.split(" ")[1];


    }

    /**
     * @description sends the email with  link with token using nodemailer for activate and reset password
     * @param {*} userInfo
     * @param {*} callback
     */
    emailSender = (userInfo, mailData, callback) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            PORT: config.port,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const endPoint = `${mailData.endPoint}`;
        ejs.renderFile(
            "app/view/resetPassword.ejs", { link: process.env.MAIL_URL + `/${endPoint}/` + userInfo.token },
            (error, data) => {
                if (error) {
                    return console.log(error);
                } else {
                    let mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: userInfo.emailId,
                        subject: mailData.subject,
                        html: ejs.render(data),
                    };
                    transporter.sendMail(mailOptions, (error, data) => {
                        if (error) {
                            logger.info(error);

                            console.log("mail not sent: " + error.message);
                            return callback(error, null);
                        } else logger.info("mail Sent");
                        console.log("mail sent: " + data);
                        return callback(null, data);
                    });
                }
            }
        );
    };
}

module.exports = new Helper();