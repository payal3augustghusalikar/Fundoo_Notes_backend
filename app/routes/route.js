module.exports = (app) => {


    const user = require('../controllers/user.ctr.js');

    // register a new user
    app.post('/register', user.register);

    // Login existing user
    app.post('/login', user.login);

    //forget password
    app.post('/forgot-password', user.forgotPassword);


    // Reset password
    // app.put('/reset-password',  user.resetPassword)
}