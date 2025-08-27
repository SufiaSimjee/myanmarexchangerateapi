const mongoose = require('mongoose');
const moment = require("moment-timezone");
const yangonDate = require("../Helpers/YangonDate");
const { Schema, model } = mongoose;

const FuelRateSchema = new Schema({
    fuelName: {
        type: String,
        index: true,
        required: true
    },
    fuelCode: {
        type: String,
        index: true,
        required: true,
        uppercase: true,
        trim: true
    },
    fuelIcon: {
        type: String,
        default: ""
    },
    rate: {
        type: Number,
        required: true
    },
    measurementUnit: {
        type: String,
        required: true,
        enum: ["per liter", "per gallon"], // restrict to these options
        default: "per liter"
    },
    source: {
        type: String,
        index: true,
        required: true,
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

FuelRateSchema.path("createdAt").get(yangonDate);
FuelRateSchema.path("updatedAt").get(yangonDate);

const FuelRate = model("FuelRate", FuelRateSchema);

module.exports =  FuelRate;