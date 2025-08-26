const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const { Schema, model } = mongoose;

const CurrencyRateSchema = new Schema({
    currencyName: {
        type: String,
        index: true,
        required: true,
    },
    currencyCode: {
        type: String,
        index: true,
        required: true,
        uppercase: true,
        trim: true
    },
    currencyIcon:{
        type: String,
        required: false,
        default:''
    },
    unit: {
        type: Number,
        required: true,
        default: 1
    },
    buyRate: {
        type: Number,
        required: true
    },
    sellRate:{
        type: Number,
        required: true
    },
    source:{
        type: String,
        index: true,
        required: true,
    },
    uploadedDate:{
        type: Date,
        index: true,
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
    uploadedBy:{
        type: String,
        index: true,
        required: true,
        default: ""
    }

},{timestamps: true});




const CurrencyRate = model('CurrencyRate', CurrencyRateSchema);

module.exports = CurrencyRate;