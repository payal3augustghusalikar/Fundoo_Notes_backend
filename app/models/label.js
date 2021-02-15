/**
 * @module       models
 * @file         label.js
 * @description  labelModel class holds the databse related methods 
 * @author       Payal Ghusalikar <payal.ghusalikar9@gmail.com>
 * @since        27/01/2021  
-----------------------------------------------------------------------------------------------*/

const mongoose = require("mongoose");

const LabelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
const Label = mongoose.model("Label", LabelSchema);

class LabelModel {
    /**
     * @param {*} labelInfo
     * @param {*} callback
     */
    create = (labelInfo, callback) => {
        const label = new Label({
            name: labelInfo.name,
            userId: labelInfo.userId,
        });
        label.save(callback);
    };

    findAll = (callback) => {
        Label.find(callback);
    };

    findOne = (labelId, callback) => {
        Label.findById(labelId, callback);
    };

    // Retrieve all labels by user
    findLabelByUser = (labelInfo) => {
        return Label.find({ userId: labelInfo.userId });
    };

    update = (labelInfo, callback) => {
        Label.findByIdAndUpdate(
            labelInfo.labelId, {
                name: labelInfo.name,
            }, { new: true },
            callback
        );
    };

    deleteById = (labelId, callback) => {
        Label.findByIdAndRemove(labelId, callback);
    };
}

module.exports = new LabelModel();