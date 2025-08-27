const mongoose = require("mongoose");
const moment = require("moment-timezone");
const yangonDate = require("../Helpers/YangonDate");
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
    uploadedDate:{
        type: Date,
        index: true,
        get: (value) => yangonDate(value),
        required: true,
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
}, {
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true }
});


MetalRateSchema.path("createdAt").get(yangonDate);
MetalRateSchema.path("updatedAt").get(yangonDate);

const MetalRate = model("MetalRate", MetalRateSchema);

module.exports = MetalRate;
