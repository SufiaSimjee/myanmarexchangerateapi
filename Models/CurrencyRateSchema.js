const mongoose = require('mongoose');
const moment = require("moment-timezone");
const ISO4217Codes = require("../Helpers/ISO4217Codes");
const {CurrencyList} = require("../Helpers/CommonCurrency");
const { Schema, model } = mongoose;



const CurrencyRateSchema = new Schema({
    currencyName: {
        type: String,
        index: true,
        required: false,
        default: ""
    },
    currencyCode: {
        type: String,
        index: true,
        required: true,
        uppercase: true,
        enum: ISO4217Codes,
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


CurrencyRateSchema.pre('save', function (next) {
    try{

        let currencyName = CurrencyList[this.currencyCode].name;
        let currencyIcon = CurrencyList[this.currencyCode].icon;

        if (currencyName) {
            this.currencyName = currencyName;
        }

        if (currencyIcon) {
            this.currencyIcon = currencyIcon;
        }
        next();
    } catch (error){
        console.error("Error while setting currency name and currency icon before saving:", error.message);
        next(error);
    }
})



const CurrencyRate = model('CurrencyRate', CurrencyRateSchema);

module.exports = CurrencyRate;