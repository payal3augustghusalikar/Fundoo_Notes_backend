const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
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

UserSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        console.log(`current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`new current password is ${this.password}`);
        this.confirmPassword = undefined;
    }
    next();
})


const User = mongoose.model('User', UserSchema);

class UserModel {

    /**
     * @param {*} userInfo 
     * @param {*} callback 
     */
    register = (userInfo, callback) => {
        const user = new User({
            name: userInfo.name,
            emailId: userInfo.emailId,
            password: userInfo.password
        });

        user.save({}, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    login = (userLoginData, callback) => {
        User.find(userLoginData, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }
}

module.exports = new UserModel();