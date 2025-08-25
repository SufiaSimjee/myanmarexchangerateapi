const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const FuelRateSchema = new Schema({
    fuelName: {
        type: String,
        required: true,
        trim: true
    },
    fuelCode: {
        type: String,
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
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    uploadedDate: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: String,
        required: true,
        default: ""
    }
}, { timestamps: true });

const FuelRate = model("FuelRate", FuelRateSchema);

module.exports =  FuelRate;