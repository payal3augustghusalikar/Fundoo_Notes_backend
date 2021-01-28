const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    emailId: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

NoteSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        console.log(`current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`new current password is ${this.password}`);
    }
    next();
})


const Note = new mongoose.model('Note', NoteSchema);

class NoteModel {

    /**
     * 
     * @param {*} noteInfo 
     * @param {*} callback 
     */
    create = (noteInfo, callback) => {
        const note = new Note({
            name: noteInfo.name,
            emailId: noteInfo.emailId,
            password: noteInfo.password
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