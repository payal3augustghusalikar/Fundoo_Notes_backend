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
require("dotenv").config();
const ejs = require("ejs");

class Helper {
    /**
     * @description create the token
     * @param {} data
     */
    createToken = (data) => {
        console.log("creating token");
        return jwt.sign({
                emailId: data.emailId,
                id: data._id,
            },
            process.env.secret_key, {
                expiresIn: "48h",
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
            console.log("decode for verify: " + decode);
            req.userData = decode;
            let userId = decode.name;
            console.log("user Id in verify token: ", userId);
            console.log("decode for verify: " + decode);
            console.log("");
            console.log("token verified");
            next();
        } catch (error) {
            res.status(401).send({
                error: "unauthorized",
            });
        }
    };

    decodeToken = (noteInfo, token) => {
        let decode = jwt.verify(token, process.env.SECRET_KEY);
        let userId = decode.id;
        console.log("user Id", userId);
        noteInfo.userId = userId;
        console.log("user id for note: ", userId);
        return noteInfo;
    };

    /**
     * @description sends the email with reset link with token using nodemailer
     * @param {*} userInfo
     * @param {*} callback
     */
    emailSender = (userInfo, callback) => {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            PORT: process.env.PORT,
            // secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("token in email : " + userInfo.token);
        ejs.renderFile(
            "app/view/resetPassword.ejs", { link: process.env.URL + "/resetPassword/" + userInfo.token },
            (error, data) => {
                if (error) {
                    return console.log(error);
                }
                let mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_RECEIVER,
                    subject: "Reset Password",
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