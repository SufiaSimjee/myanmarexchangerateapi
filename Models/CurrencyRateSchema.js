const mongoose = require('mongoose');
const moment = require("moment-timezone");
const ISO4217Codes = require("../Helpers/ISO4217Codes");
const {CurrencyList} = require("../Helpers/CommonCurrency");
const yangonDate = require("../Helpers/YangonDate");
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
    uploadedBy:{
        type: String,
        index: true,
        required: true,
        default: ""
    }

},{
    timestamps: true,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },

});

CurrencyRateSchema.virtual("percentageChange").get(function () {
    try{
        return this.$locals.percentageChange || {
            buyRateChange: null,
            sellRateChange: null
        };
    } catch(error){
        return null;
    }
});


CurrencyRateSchema.path("createdAt").get(yangonDate);
CurrencyRateSchema.path("updatedAt").get(yangonDate);


CurrencyRateSchema.pre('save', async function (next) {
    try{

        let currencyName = CurrencyList[this.currencyCode].name;
        let currencyIcon = CurrencyList[this.currencyCode].icon;

        if (currencyName) {
            this.currencyName = currencyName;
        }

        if (currencyIcon) {
            this.currencyIcon = currencyIcon;
        }
        const prevRates = await this.constructor.findOne({
            currencyCode: this.currencyCode,
            unit: this.unit,
            source: { $regex: `^${this.source}$`, $options: 'i' },
            uploadedBy: { $regex: `^${this.uploadedBy}$`, $options: 'i' }
        }).sort({ uploadedDate: -1 });

        if(prevRates) {
            const buyRateChange = ((this.buyRate - prevRates.buyRate) / prevRates.buyRate) * 100;
            const sellRateChange = ((this.sellRate - prevRates.sellRate) / prevRates.sellRate) * 100;

            this.$locals.percentageChange = {
                buyRateChange: buyRateChange.toFixed(2) + "%",
                sellRateChange: sellRateChange.toFixed(2) + "%"
            };
        }
        next();
    } catch (error){
        console.error("Error while setting currency name and currency icon before saving:", error.message);
        next(error);
    }
})



const CurrencyRate = model('CurrencyRate', CurrencyRateSchema);

module.exports = CurrencyRate;