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
        unique: false,
        default: ""
    },
    currencyCode: {
        type: String,
        index: true,
        required: true,
        uppercase: true,
        unique: false,
        enum: ISO4217Codes,
        trim: true
    },
    currencyIcon:{
        type: String,
        required: false,
        unique: false,
        default:''
    },
    unit: {
        type: Number,
        required: false,
        unique: false,
        default: 1
    },
    buyRate: {
        type: Number,
        required: true,
        unique: false,
    },
    sellRate:{
        type: Number,
        required: true,
        unique: false
    },
    source:{
        type: String,
        index: true,
        required: true,
        unique: false
    },
    uploadedDate:{
        type: Date,
        unique: false,
        index: true,
        get: (value) => {
            return yangonDate(value)
        },
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
        unique: false,
        required: true,
        default: ""
    }

},{
    timestamps: true,
    id: false,
    toJSON: { getters: true },
    toObject: { getters: true },

});




CurrencyRateSchema.path("createdAt").get(yangonDate);
CurrencyRateSchema.path("updatedAt").get(yangonDate);


CurrencyRateSchema.pre('save',function (next) {
    try{

        let currencyName = CurrencyList[this.currencyCode]?.name;
        let currencyIcon = CurrencyList[this.currencyCode]?.icon;

        if (currencyName !== undefined || currencyName !== null || !currencyName) {
            this.currencyName = currencyName;
        } else{
            this.currencyName = "";
        }

        if (currencyIcon !== undefined || currencyIcon !== null || !currencyIcon) {
            this.currencyIcon = currencyIcon;
        } else {
            this.currencyIcon = "";
        }

        next();
    } catch (error){
        console.error(`Error while setting currency name and currency icon before saving (${this.currencyCode}):`, error.message);
        next();
    }
})


// Method to calculate the percentage change in buy and sell rates
// compared to the most recent previous entry for the same currency,
// unit, source, and uploader.

CurrencyRateSchema.methods.getPercentageChange = async function () {
    try {
        const prevRate = await this.constructor.findOne({
            currencyCode: this.currencyCode,
            unit: this.unit,
            source: { $regex: `^${this.source}$`, $options: 'i' },
            uploadedBy: { $regex: `^${this.uploadedBy}$`, $options: 'i' }
        }).skip(1)
            .sort({ uploadedDate: -1 })
            .select('_id buyRate sellRate uploadedDate')


        if (!prevRate || !prevRate.buyRate || !prevRate.sellRate) {
            return {
                buyRateChange: null,
                sellRateChange: null
            };
        }

        const buyRateChange = ((this.buyRate - prevRate.buyRate) / prevRate.buyRate) * 100;
        const sellRateChange = ((this.sellRate - prevRate.sellRate) / prevRate.sellRate) * 100;

        const result = this.toObject();
        result.currencyInfo = CurrencyList[this.currencyCode];
        result.percentageChange = {
            buyRateChange: buyRateChange !== null ? buyRateChange.toFixed(2) + "%" : null,
            sellRateChange: sellRateChange !== null ? sellRateChange.toFixed(2) + "%" : null
        };

        return result;
    } catch (err) {
        const result = this.toObject();
        result.percentageChange = {
            buyRateChange: null,
            sellRateChange: null
        };
        return result;
    }
};


const CurrencyRate = model('CurrencyRate', CurrencyRateSchema);

module.exports = CurrencyRate;