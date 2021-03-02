/**
 * @module      routes
 * @file         route.js
 * @description  provide the routes for user as well note operations
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021
-----------------------------------------------------------------------------------------------*/

var helper = require("../../middleware/helper.js");
var redisCache = require("../../middleware/redisCache.js");
const notes = require("../controllers/note.js");

module.exports = (app) => {
    // Create a new note
    app.post("/notes", helper.verifyToken, notes.create);

    // Retrieve all notes
    app.get("/notes", helper.verifyToken, notes.findAll);

    // Retrieve a single note with noteId
    app.get("/notes/:noteId", helper.verifyToken, notes.findOne);

    //  add label to specific note
    app.put(
        "/notes/addlabeltonote/:noteId",
        helper.verifyToken,
        notes.addLabelToNote
    );

    //  remove label to specific note
    app.put(
        "/notes/removelabelfromnote/:noteId",
        helper.verifyToken,
        notes.removelabelfromnote
    );

    // // Update a note with noteId
    app.put("/notes/:noteId", helper.verifyToken, notes.update);

    // // Delete a note with noteId
    // // app.delete("/notes/:noteId", helper.verifyToken, notes.delete);

    // delete note by setting isdeleted flag true
    app.put("/notes/delete/:noteId", helper.verifyToken, notes.deleteNote);

    // delete note forever
    app.delete(
        "/notes/deleteforever/:noteId",
        helper.verifyToken,
        notes.deleteForever
    );

    // add a new collaborator
    app.put(
        "/addcollaborator/:noteId",
        helper.verifyToken,
        notes.addCollaborator
    );

    // remove a new collaborator
    app.put(
        "/removecollaborator/:noteId",
        helper.verifyToken,
        notes.removeCollaborator
    );
};