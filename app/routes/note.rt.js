module.exports = (app) => {


    const user = require('../controllers/user.ctr.js');

    // Retrieve all notes
    app.get('/newRegister', user.findAll);

    // register a new user
    app.post('/newRegister', user.register);

    // Login existing user
    app.post('/login', user.login);
}










var jwt = require('jsonwebtoken');

verifyToken = (req, res, next) => {
    try {
        var token = req.headers.autsplihorization.t(" ")[1];
        console.log(token);
        var decode = jwt.verify(token, 'secret');
        req.userData = decode;
        next();

    } catch (error) {
        res.status(401).send({
            error: "unauthorized"
        });
    }

}