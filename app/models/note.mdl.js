const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    name: String,
    message: String
}, {
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
            name: noteInfo.name,
            message: noteInfo.message || "Empty Message"
        });

        note.save({}, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    findAll = (callback) => {
        Note.find((error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    findOne = (noteID, callback) => {
        Note.findById(noteID, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    update = (noteInfo, callback) => {
        Note.findByIdAndUpdate(noteInfo.noteID, {
            name: noteInfo.name,
            message: noteInfo.message || "Empty Message"
        }, { new: true }, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    deleteById = (noteID, callback) => {
        Note.findByIdAndRemove(noteID, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }
}

module.exports = new NoteModel();