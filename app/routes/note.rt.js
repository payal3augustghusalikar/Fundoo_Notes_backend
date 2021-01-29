module.exports = (app) => {


    const user = require('../controllers/user.ctr.js');

    // Retrieve all notes
    app.get('/newRegister', user.findAll);

    // register a new user
    app.post('/newRegister', user.register);

    // Login existing user
    app.post('/login', user.login);
}