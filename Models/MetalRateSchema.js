const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MetalRateSchema = new Schema({
    metalName: {
        type: String,
        required: true,
        trim: true
    },
    metalCode: {
        type: String,
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

const MetalRate = model("MetalRate", MetalRateSchema);

module.exports = MetalRate;
