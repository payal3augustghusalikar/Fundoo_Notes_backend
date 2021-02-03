const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
var helper = require("../../middleware/helper.js");
const logger = require("../../logger/logger.js");

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
        this.password = await bcrypt.hash(this.password, 10);
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
    save = (userInfo, callback) => {
        const user = new User({
            name: userInfo.name,
            emailId: userInfo.emailId,
            password: userInfo.password
        });

        user.save((error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    find = (userLoginData, callback) => {
        User.find(userLoginData, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    findOne = (userInfo, callback) => {
        User.findOne(userInfo, (error, data) => {
            if (error) {
                logger.error('Some error occurred')
                return callback(new Error("Some error occurred"), null)
            } else if (!data) {
                logger.error('User not found with this email Id')
                return callback(new Error("User not found with this email Id"), null)
            } else {
                return callback(null, data)
            }
        })
    }

    update = (userInfo, callback) => {
        User.findOneAndUpdate(userInfo.emailId, { password: userInfo.newPassword }, { new: true }, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }
}

module.exports = new UserModel();