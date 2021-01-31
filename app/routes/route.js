module.exports = (app) => {


    const user = require('../controllers/user.ctr.js');

    // register a new user
    app.post('/Register', user.register);

    // Login existing user
    app.post('/login', user.login);
}