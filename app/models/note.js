/**
 * @module       models
 * @file         note.js
 * @description  noteModel class holds the databse related methods 
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    labelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
const Note = mongoose.model("Note", NoteSchema);

class NoteModel {
    /**
     * @param {*} noteInfo
     * @param {*} callback
     */
    create = (noteInfo, callback) => {
        const note = new Note({
            title: noteInfo.title,
            description: noteInfo.description || "Empty description",
            labelId: noteInfo.labelId,
        });
        note.save(callback);
    };

    findAll = (callback) => {
        Note.find(callback);
    };

    findOne = (noteID, callback) => {
        Note.findById(noteID, callback);
    };

    findNotesByLabel = (labelId, callback) => {
        Note.findById(labelId, callback);
    };

    update = (noteInfo, callback) => {
        Note.findByIdAndUpdate(
            noteInfo.noteID, {
                title: noteInfo.title,
                description: noteInfo.description || "Empty description",
            }, { new: true },
            callback
        );
    };

    deleteById = (noteID, callback) => {
        Note.findByIdAndRemove(noteID, callback);
    };
}

module.exports = new NoteModel();