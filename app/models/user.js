/**
 * @module       models
 * @file         user.js
 * @description  userModel class holds the databse related methods 
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//const bycrypt = require("bcrypt");
const helper = require("../../middleware/helper.js");
const logger = require("../../logger/logger.js");
let vallidator = require("../../middleware/vallidation.js");
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        length: {
            min: 3,
            max: 36,
        },
        test: vallidator.namePattern,
    },
    lastName: {
        type: String,
        required: true,
        length: {
            min: 3,
            max: 36,
        },
        test: vallidator.namePattern,
    },
    emailId: {
        type: String,
        unique: true,
        required: true,
        test: vallidator.emailIdPattern,
    },
    password: {
        type: String,
        required: true,
        length: {
            min: 6,
            max: 15,
        },
        test: vallidator.passwordPattern,
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
UserSchema.set("versionKey", false);

// encrypted the password before saving to database
UserSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPassword = undefined;
    }
    next();
});

const User = mongoose.model("User", UserSchema);

class UserModel {
    /**
     * @description save the user to database
     * @param {*} userInfo
     * @param {*} callback is for service class
     */
    save = (userInfo, callback) => {
        const user = new User({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            emailId: userInfo.emailId,
            password: userInfo.password,
        });
        user.save((error, data) => {
            if (error) return callback(error, null);
            else return callback(null, data);
        });
    };

    /**
     * @description find the user
     * @param {*} userLoginData
     * @param {*} callback
     */
    find = (userLoginData, callback) => {
        User.find({ emailId: userLoginData.emailId }, (error, data) => {
            if (error) return callback(error, null);
            else return callback(null, data);
        });
    };

    /**
     * @description find the one user in database
     * @param {*} userInfo
     * @param {*} callback is for service class
     */
    findOne = (userInfo, callback) => {
        User.findOne({ emailId: userInfo.emailId }, (error, data) => {
            if (error) {
                logger.error("Some error occurred");
                return callback(new Error("Some error occurred"), null);
            } else if (!data) {
                return callback(new Error("User not found with this email Id"), null);
            } else {
                return callback(null, data);
            }
        });
    };

    /**
     * @description takes th userInfo and update the user
     * @param {*} userInfo
     * @param {*} callback
     */
    update = (userInfo, callback) => {
        console.log("mdl");
        const newPassword = userInfo.newPassword;
        console.log(newPassword);
        // newPassword = await bcrypt.hash(newPassword, 10);
        console.log(newPassword);
        // userInfo.confirmPassword = undefined;
        bcrypt.hash(newPassword, 10, function(error, hash) {
            if (error) {
                error = "New password unable to hash";
                callback(error, null);
            } else {
                console.log(hash);
                User.findByIdAndUpdate(
                    userInfo.userId, { $set: { password: hash } }, { new: true },
                    (error, data) => {
                        if (error) return callback(error, null);
                        else return callback(null, data);
                    }
                );
            }
        });
    };

    /**
     * @description takes th userInfo and update the user
     * @param {*} userInfo
     * @param {*} callback
     */
    activateOne = (userInfo, callback) => {
        return User.findByIdAndUpdate(
            userInfo.userId, { $set: { isActivated: true } }, { new: true },
            callback
        );
    };


    /**
     * find the user using id
     * @param {*} collaboratorId holds the user id
     */
    findOneuserWithId = (collaboratorId) => {
        return User.findById({ _id: collaboratorId }).then((data) => {
            return data;
        });
    };
}

module.exports = new UserModel();