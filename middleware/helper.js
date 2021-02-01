var jwt = require("jsonwebtoken");
const logger = require("../logger/logger");


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

    emailSender = (userInfo, callBack) => {
        var transporter = nodemailer.createTransport({
            auth: {
                user: "payal.ghusalikar9@gmail.com",
                pass: "ghjbvb",
            },
        });
        var currentDateTime = new Date();
        var mailOptions = {
            from: "payal.ghusalikar9@gmail.com",
            to: "payal.ghusalikar9@gmail.com",
            subject: "Reset Password",
            html: "<h3> Hello </h3>\
      <a href=`http://localhost:2001/resetPassword/" + currentDateTime + "+++" + userInfo.email + "`>click on this link </a>\
      "
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error)
                logger.info(error);

            else
                logger.info("mail Sent")

        })
    };
}

module.exports = new Helper();