const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const moment = require("moment");
const { Schema, model } = mongoose;

const CurrencyRateSchema = new Schema({
    currencyName: {
        type: String,
        required: true,
        trim: true
    },
    currencyCode: {
        type: String,
        required: true,
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
        required: true,
        trim: true
    },
    uploadedDate:{
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                const uploadedDate = moment(value, [moment.ISO_8601, "YYYY-MM-DD HH:mm:ss"], true);
                const currentDate = moment();

                return uploadedDate.isValid() && uploadedDate.isSameOrBefore(currentDate);
            },
            message: `Uploaded date cannot be in the future!`

        }
    },
    uploadedBy:{
        type: String,
        required: true,
        default: ""
    }

},{timestamps: true});




const CurrencyRate = model('CurrencyRate', CurrencyRateSchema);

module.exports = CurrencyRate;