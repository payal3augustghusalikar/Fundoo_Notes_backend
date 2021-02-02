var jwt = require("jsonwebtoken");
const logger = require("../../logger/logger");
var nodemailer = require("nodemailer");
require("dotenv").config();
const ejs = require("ejs");

class Helper {
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

    verifyToken = (req, res, next) => {
        try {
            var token = req.headers.authorization.split(" ")[1];
            console.log(token);
            var decode = jwt.verify(token, process.env.SECRET_KEY);
            req.userData = decode;
            next();
        } catch (error) {
            res.status(401).send({
                error: "unauthorized",
            });
        }
    };

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
        http: //localhost:2001/resetPassword/ " + currentDateTime + "+++ " + userInfo.email + "
            // var currentDateTime = new Date();
            ejs.renderFile(
                // "app/view/forgotPassword.ejs", { link: userInfo.token },
                "app/view/forgotPassword.ejs", { link: "http://localhost:2001/ " + userInfo.email + userInfo.token },


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
                            // return callback(null, data);
                        } else logger.info("mail Sent");
                        console.log("mail sent: " + data);
                        return callback(null, data);
                    });
                }
            );

        //<a href=`http://localhost:2001/resetPassword/ " + currentDateTime + "+++ " + userInfo.email + "`>click on this link </a>\ "

        // emailSender = (userInfo, callBack) => {
        //     transporter = nodemailer.createTransport({
        //         host: 'smtp.zoho.com',
        //         port: 465,
        //         secure: true, // use SSL
        //         auth: {
        //             user: 'testmail@zoho.com',
        //             pass: '123456'
        //         }
        //     });

        //     ejs.renderFile(__dirname + "/test.ejs", { name: 'Stranger' }, function(err, data) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             var mainOptions = {
        //                 from: '"Tester" testmail@zoho.com',
        //                 to: "totest@zoho.com",
        //                 subject: 'Hello, world',
        //                 html: data
        //             };
        //             console.log("html data ======================>", mainOptions.html);
        //             transporter.sendMail(mainOptions, function(err, info) {
        //                 if (err) {
        //                     console.log(err);
        //                 } else {
        //                     console.log('Message sent: ' + info.response);
        //                 }
        //             });
        //         }

        //     });

        // }
    };
}
module.exports = new Helper();