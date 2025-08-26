const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { Schema, model } = mongoose;

const MetalRateSchema = new Schema({
    metalName: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    metalCode: {
        type: String,
        index: true,
        required: true,
        uppercase: true,
        trim: true
    },
    metalIcon: {
        type: String,
        default: ""
    },
    buyRate: {
        type: Number,
        required: true
    },
    sellRate: {
        type: Number,
        required: true
    },
    measurementUnit: {
        type: String,
        required: true,
        enum: ["per gram", "per kg", "per ounce"], // restrict to valid units
        default: "per gram"
    },
    source: {
        type: String,
        index: true,
        required: true
    },
    location: {
        type: String,
        index: true,
        required: true,
        trim: true
    },
    uploadedDate: {
        type: Date,
        index: true,
        default: Date.now,
        validate: {
            validator: function (value) {
                const uploadedDate = moment.tz(value, "Asia/Yangon");
                const currentDate = moment.tz("Asia/Yangon");

                // Check if uploadedDate is valid and not in the future
                return uploadedDate.isValid() && uploadedDate.isSameOrBefore(currentDate);
            },
            message: `Uploaded date cannot be in the future!`

        }
    },
    uploadedBy: {
        type: String,
        index: true,
        required: true,
        default: ""
    }
}, { timestamps: true });

const MetalRate = model("MetalRate", MetalRateSchema);

module.exports = MetalRate;
