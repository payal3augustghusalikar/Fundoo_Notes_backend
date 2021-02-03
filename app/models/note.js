const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    description: String
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
            title: noteInfo.title,
            description: noteInfo.description || "Empty description"
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
            title: noteInfo.title,
            description: noteInfo.description || "Empty description"
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