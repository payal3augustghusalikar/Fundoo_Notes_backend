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
            let token = req.headers.authorization.split(" ")[1];
            console.log(token);
            const decode = jwt.verify(token, process.env.SECRET_KEY);
            req.userData = decode;
            next();
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
            "app/view/resetPassword.ejs", { link: process.env.URL + `/${endPoint}/` + userInfo.token },
            (error, data) => {
                if (error) {
                    return console.log(error);
                }
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
        );
    };
}

module.exports = new Helper();