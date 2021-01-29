module.exports = (app) => {

    const user = require('../controllers/user.ctr.js');

    // register a new user
    app.post('/newRegister', user.register);

    // Login existing user
    app.post('/login', user.login);
}