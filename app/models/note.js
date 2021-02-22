/**
 * @module       models
 * @file         note.js
 * @description  noteModel class holds the databse related methods 
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");
const logger = require("../../logger/logger.js");
const Label = require("../models/label.js");

const NoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    labelId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Label",
    }, ],
}, { versionKey: false }, {
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
            description: noteInfo.description,
            userId: noteInfo.userId,
        });
        note.save(callback);
    };
    /**
     *
     * @param {*} callback
     */
    findAll = (callback) => {
        Note.find((error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {
                return callback(null, data);
            }
        });
    };
    /**
     *
     * @param {*} noteID
     * @param {*} callback
     */
    findOne = (noteID, callback) => {
        Note.findById(noteID, callback);
    };
    /**
     *
     * @param {*} labelId
     * @param {*} callback
     */
    findNotesByLabel = (labelId, callback) => {
        Note.findById(labelId, callback);
    };
    /**
     *
     * @param {*} noteInfo
     * @param {*} callback
     */
    update = (noteInfo, callback) => {
        Note.findByIdAndUpdate(
            noteInfo.noteID, {
                title: noteInfo.title,
                description: noteInfo.description,
            }, { new: true },
            callback
        );
    };
    /**
     *
     * @param {*} noteID
     * @param {*} callback
     */
    deleteById = (noteID, callback) => {
        Note.findByIdAndRemove(noteID, callback);
    };

    addLabelToSingleNote = (noteInfo, callback) => {
        console.log("model");
        return Label.findOne({ _id: noteInfo.labelId }).then((label) => {
            console.log("model");
            if (label) {
                logger.info("label found");
                return Note.findByIdAndUpdate(
                    noteInfo.noteID, {
                        labelId: noteInfo.labelId,
                    }, { new: true },
                    callback
                );
            }
        });
    };
}

module.exports = new NoteModel();