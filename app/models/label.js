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
     */
    create = (labelInfo) => {
        const label = new Label({
            name: labelInfo.name,
            userId: labelInfo.userId,
        });
        return label.save({});
    };

    findAll = () => {
        return Label.find();
    };

    findOne = (labelId) => {
        return Label.findById(labelId);
    };

    update = (labelInfo) => {
        return Label.findByIdAndUpdate(
            labelInfo.labelId, {
                name: labelInfo.name,
            }, { new: true }
        );
    };

    deleteById = (labelId) => {
        return Label.findByIdAndRemove(labelId);
    };

    findLabelByUserId = (userId) => {
        return Label.find({ userId });
    };
}

module.exports = new LabelModel();