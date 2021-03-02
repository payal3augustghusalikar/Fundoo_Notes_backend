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
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    __v: { type: Number, select: false },
}, {
    timestamps: true,
});
const Label = mongoose.model("Label", LabelSchema);

class LabelModel {
    /**
     * @description create and save new label
     * @param {*} labelInfo holds label data
     * @param {*} callback is for service class method
     */
    create = async(labelInfo, callback) => {
        const label = new Label({
            name: labelInfo.name,
            userId: labelInfo.userId,
        });
        const data = await label.save(callback);
        return data;
    };

    /**
     * @description find all labels from db
     * @param {*} callback for service class method
     */
    findAll = (callback) => {
        console.log("Model");
        return Label.find(callback);
    };

    /**
     * @description find one label from db
     * @param {*} labelId
     * @param {*} callback
     */
    findOne = (labelId, callback) => {
        return Label.findById(labelId, callback);
    };

    /**
     * @description update label with id
     * @param {*} labelInfo
     * @param {*} callback
     */
    update = (labelInfo, callback) => {
        return Label.findByIdAndUpdate(
            labelInfo.labelID, {
                name: labelInfo.name,
            }, { new: true },
            callback
        );
    };

    /**
     * @description delete label by Id
     * @param {*} labelId
     * @param {*} callback
     */
    deleteById = (labelId, callback) => {
        return Label.findByIdAndRemove(labelId, callback);
    };
}

module.exports = new LabelModel();