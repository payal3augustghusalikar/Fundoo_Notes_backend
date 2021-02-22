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
    app.get("/notes", helper.verifyToken, redisCache.redisGet, notes.findAll);

    // Retrieve a single note with noteId
    app.get("/notes/:noteId", helper.verifyToken, notes.findOne);

    // Retrieve a single note with labelId
    //  app.get("/notes/:labelId", helper.verifyToken, notes.findNotesByLabelId);

    // Update a note with noteId
    app.put("/notes/:noteId", helper.verifyToken, notes.update);

    // Delete a note with noteId
    app.delete("/notes/:noteId", helper.verifyToken, notes.delete);
};