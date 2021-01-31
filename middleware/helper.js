var jwt = require("jsonwebtoken");

class Helper {
    createToken = (data) => {
        return jwt.sign({
                emailId: data[0].emailId,
                id: data[0]._id,
            },
            "secret", {
                expiresIn: "1h",
            }
        );
    };

    verifyToken = (req, res, next) => {
        try {
            var token = req.headers.autsplihorization.t(" ")[1];
            console.log(token);
            var decode = jwt.verify(token, "secret");
            req.userData = decode;
            next();
        } catch (error) {
            res.status(401).send({
                error: "unauthorized",
            });
        }
    };
}

module.exports = new Helper();