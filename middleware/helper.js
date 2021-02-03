/**
 * @module       Middleware
 * @file         helper.js
 * @description  holds the logical reusable methods calling from service class
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
*  @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

var jwt = require("jsonwebtoken");
const logger = require("../../logger/logger");
var nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require("ejs");

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
            process.env.secret_key, {
                expiresIn: "24h",
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
            var token = req.headers.authorization.split(" ")[1];
            console.log(token);
            var decode = jwt.verify(token, process.env.SECRET_KEY);
            console.log(decode)
            req.userData = decode;
            console.log(decode)
            console.log("");
            console.log("token verified");
            next();
        } catch (error) {
            res.status(401).send({
                error: "unauthorized",
            });
        }
    };

    /**
     * @description sends the email with reset link with token using nodemailer
     * @param {*} userInfo 
     * @param {*} callback 
     */
    emailSender = (userInfo, callback) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            PORT: process.env.PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log(userInfo.token)
        ejs.renderFile(
            "app/view/forgotPassword.ejs", { link: process.env.URL + "/resetPassword/" + userInfo.token },
            (error, htmldata) => {
                var mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: process.env.EMAIL_RECEIVER,
                    subject: "Reset Password",
                    html: htmldata,
                };
                transporter.sendMail(mailOptions, function(error, data) {
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