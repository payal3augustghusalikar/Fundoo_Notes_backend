var helper = require("../../middleware/helper.js");

module.exports = (app) => {

    const user = require('../controllers/user.js');

    // register a new user
    app.post('/register', user.register);

    // Login existing user
    app.post('/login', user.login);

    //forget password
    app.post('/forgotpassword', helper.verifyToken, user.forgotPassword);

    // Reset password
    app.put('/resetpassword', helper.verifyToken, user.resetPassword)
}