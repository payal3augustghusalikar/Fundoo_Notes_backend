/**
 * @module      routes
 * @file         route.js
 * @description  provide the routes for user as well note operations
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

var helper = require("../../middleware/helper.js");

module.exports = (app) => {
    const user = require("../controllers/user.js");
    const notes = require("../controllers/note.js");

    // // register a new user
    // app.post("/register", user.register);

    // // Login existing user
    // app.post("/login", user.login);

    // //forget password
    // app.post("/forgotpassword", user.forgotPassword);

    // // Reset password
    // app.put("/resetpassword", helper.verifyToken, user.resetPassword);

    // Create a new note
    app.post("/notes", helper.verifyToken, notes.create);

    // Retrieve all notes
    app.get("/notes", helper.verifyToken, notes.findAll);

    // Retrieve a single note with noteId
    app.get("/notes/:noteId", helper.verifyToken, notes.findOne);

    // Update a note with noteId
    app.put("/notes/:noteId", helper.verifyToken, notes.update);

    // Delete a note with noteId
    app.delete("/notes/:noteId", helper.verifyToken, notes.delete);
};