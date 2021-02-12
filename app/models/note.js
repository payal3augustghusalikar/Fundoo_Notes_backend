const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
        title: String,
        description: String
    },
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },

    {
        timestamps: true
    });
const Note = mongoose.model('Note', NoteSchema);

class NoteModel {

    /**
     * 
     * @param {*} noteInfo 
     * @param {*} callback 
     */
    create = (noteInfo, callback) => {
        const note = new Note({
            title: noteInfo.title,
            description: noteInfo.description || "Empty description"
        });

        note.save((error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    findAll = (callback) => {
        Note.find((error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    findOne = (noteID, callback) => {
        Note.findById(noteID, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    update = (noteInfo, callback) => {
        Note.findByIdAndUpdate(noteInfo.noteID, {
            title: noteInfo.title,
            description: noteInfo.description || "Empty description"
        }, { new: true }, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }

    deleteById = (noteID, callback) => {
        Note.findByIdAndRemove(noteID, (error, data) => {
            return (error) ?
                callback(error, null) :
                callback(null, data);
        });
    }
}

module.exports = new NoteModel();