/**
 * @module       models
 * @file         user.js
 * @description  userModel class holds the databse related methods 
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const helper = require("../../middleware/helper.js");
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

// encrypted the password before saving to database
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
     * @description save the user to database 
     * @param {*} userInfo 
     * @param {*} callback is for service class
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

    /**
     * @description find the user
     * @param {*} userLoginData 
     * @param {*} callback 
     */
    find = (userLoginData, callback) => {
        User.find(userLoginData, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }

    /**
     * @description find the one user in database
     * @param {*} userInfo 
     * @param {*} callback is for service class
     */
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

    /**
     * @description takes th userInfo and update the user
     * @param {*} userInfo 
     * @param {*} callback 
     */
    update = (userInfo, callback) => {
        User.findByIdAndUpdate(userInfo.userId, { password: userInfo.newPassword }, { new: true }, (error, data) => {
            if (error)
                return callback(error, null);
            else
                return callback(null, data);
        });
    }
}

module.exports = new UserModel();