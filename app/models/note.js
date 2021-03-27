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
const User = require("../models/user.js");
//const User = mongoose.model("User", UserSchema);
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
    isArchived: {
        type: Boolean,
        default: false,
    },
    color: {
        type: String,
    },
    reminder: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    collaborator: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ],
}, {
    timestamps: true,
});
NoteSchema.set("versionKey", false);
const Note = mongoose.model("Note", NoteSchema);

class NoteModel {
    /**
     * @description crete new note
     * @param {*} noteInfo holds data from user
     * @param {*} callback
     */
    create = (noteInfo, callback) => {
        const note = new Note({
            title: noteInfo.title,
            description: noteInfo.description,
            userId: noteInfo.userId,
        });
        note.save((error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else {

                return callback(null, data);
            }
        })
    };

    /**
     * @description find all notes from db
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
     *@description find single note from db using id
     * @param {*} noteID
     * @param {*} callback
     */
    findOne = (noteID, callback) => {
        Note.findById(noteID, callback);
    };

    /**
     * @description update a note by Id
     * @param {*} noteInfo
     * @param {*} callback
     */
    update = (noteInfo, callback) => {
        console.log(" noteInfo.noteID", noteInfo.noteID)
        return Note.findByIdAndUpdate(
            noteInfo.noteID, {
                title: noteInfo.title,
                description: noteInfo.description,
            }, { new: true },
            callback
        );
    };

    // /**
    //  * @description harddelete the note by id from databse and returns the result to service
    //  * @param {*} noteID coming from service class
    //  * @param {*} callback callback for service class
    //  */
    // deleteById = (noteID, callback) => {
    //     console.log("delete mdl")
    //     Note.findByIdAndRemove(noteID, callback);
    // };

    /**
     * @description add lable to single note
     * @param {*} noteInfo holds labelid and noteId
     * @param {*} callback returns error or data to service
     */
    addLabelToSingleNote = (noteInfo, callback) => {
        Note.findById(noteInfo.noteID, (error, noteData) => {
            if (error) callback(error, null);
            else if (!noteData.labelId.includes(noteInfo.labelId)) {
                return Note.findByIdAndUpdate(
                    noteInfo.noteID, {
                        $push: {
                            labelId: noteInfo.labelId,
                        },
                    }, { new: true },
                    callback
                );
            }
            // return callback(error, null);
        });
    };

    /**
     * @description remove lable from single note
     * @param {*} noteInfo holds labelid and noteId
     * @param {*} callback returns error or data to service
     */
    removeLabel = (noteInfo, callback) => {
        logger.info("label found");
        return Note.findByIdAndUpdate(
            noteInfo.noteID, {
                $pull: { labelId: noteInfo.labelId },
            }, { new: true },
            callback
        );
    };

    /**
     * @description delte note forever from db by id(harddelete)
     * @param {*} noteID
     * @param {*} callback
     */
    deleteNoteById = (noteID, callback) => {
        console.log("delete mdl")
        return Note.findById(noteID, (error, data) => {
            if (error) return callback(error, null);
            else {
                console.log("Note found");
                Note.findByIdAndRemove(noteID, callback);
                // return callback(null, data);
            }
        });
    };

    /**
     * @description remove note temporary by setting isdeleted flag true(softdelete)
     * @param {*} noteID
     * @param {*} callback
     */
    removeNote = (noteID, callback) => {
        return Note.findByIdAndUpdate(
            noteID, { isDeleted: true }, { new: true },
            callback
        );
    };

    /**
     * @description remove note temporary by setting isdeleted flag true
     * @param {*} noteID
     * @param {*} callback
     */
    restore = (noteID, callback) => {
        return Note.findByIdAndUpdate(
            noteID, { isDeleted: false }, { new: true },
            callback
        );
    };



    /**
     * @description update note by adding collaborator
     * @param {*} collaborator hofds noteid and collaboratorId
     */
    findCollaborator = (collaborator) => {
        return Note.findById(collaborator.noteId).then((noteData) => {
            if (!noteData.collaborator.includes(collaborator.collaboratorId)) {
                return Note.findByIdAndUpdate(
                    collaborator.noteId, {
                        $push: {
                            collaborator: collaborator.collaboratorId,
                        },
                    }, { new: true }
                );
            }
        });
    };

    /**
     * @description update note by removing collaborator
     * @param {*} collaborator hofds noteid and collaboratorId
     */
    removeCollaborator = (collaboratorData, callback) => {
        logger.info("Note found");
        return Note.findByIdAndUpdate(
            collaboratorData.noteId, {
                $pull: { collaborator: collaboratorData.collaboratorId },
            }, { new: true },
            callback
        );
    };
}

module.exports = new NoteModel();