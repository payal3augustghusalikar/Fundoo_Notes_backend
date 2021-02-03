/**
 * @module      routes
 * @file         route.js
 * @description  provide the routes for user as well note operations
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

var helper = require("../../middleware/helper.js");

module.exports = (app) => {

    const user = require('../controllers/user.js');
    const notes = require('../controllers/note.js');

    // register a new user
    app.post('/register', user.register);

    // Login existing user
    app.post('/login', user.login);

    //forget password
    app.post('/forgotpassword', helper.verifyToken, user.forgotPassword);

    // Reset password
    app.put('/resetpassword', helper.verifyToken, user.resetPassword)


    // Create a new note	
    app.post('/notes', notes.create);

    // Retrieve all notes	
    app.get('/notes', notes.findAll);

    // Retrieve a single note with noteId	
    app.get('/notes/:noteId', notes.findOne);

    // Update a note with noteId	
    app.put('/notes/:noteId', notes.update);

    // Delete a note with noteId	
    app.delete('/notes/:noteId', notes.delete);
}