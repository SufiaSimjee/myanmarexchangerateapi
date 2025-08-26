const mongoose = require('mongoose');
const moment = require("moment-timezone");
const { Schema, model } = mongoose;

const ISO4217Codes = [
    "AFN","EUR","ALL","DZD","USD","AOA","XCD","ARS","AMD","AWG","AUD","AZN",
    "BSD","BHD","BDT","BBD","BYN","BZD","XOF","BMD","INR","BTN","BOB","BOV",
    "BAM","BWP","NOK","BRL","BND","BGN","BIF","CVE","KHR","XAF","CAD","KYD",
    "CLP","CLF","CNY","COP","COU","KMF","CDF","NZD","CRC","CUP","XCG","CZK",
    "DKK","DJF","DOP","EGP","SVC","ERN","SZL","ETB","FKP","FJD","XPF","GMD",
    "GEL","GHS","GIP","GTQ","GBP","GNF","GYD","HTG","HNL","HKD","HUF","ISK",
    "IDR","XDR","IRR","IQD","ILS","JMD","JPY","JOD","KZT","KES","KPW","KRW",
    "KWD","KGS","LAK","LBP","LSL","ZAR","LRD","LYD","CHF","MOP","MKD","MGA",
    "MWK","MYR","MVR","MRU","MUR","XUA","MXN","MXV","MDL","MNT","MAD","MZN",
    "MMK","NAD","NPR","NIO","NGN","OMR","PKR","PAB","PGK","PYG","PEN","PHP",
    "PLN","QAR","RON","RUB","RWF","SHP","WST","STN","SAR","RSD","SCR","SLE",
    "SGD","XSU","SBD","SOS","SSP","LKR","SDG","SRD","SEK","CHE","CHW","SYP",
    "TWD","TJS","TZS","THB","TOP","TTD","TND","TRY","TMT","UGX","UAH","AED",
    "USN","UYU","UYI","UYW","UZS","VUV","VES","VED","VND","YER","ZMW","ZWG",
    "XBA","XBB","XBC","XBD","XTS","XXX","XAU","XPD","XPT","XAG",

    // Historical / legacy codes
    "AFA","FIM","ALK","ADP","ESP","FRF","AOK","AON","AOR","ARA","ARP","ARY",
    "RUR","ATS","AYM","AZM","BYB","BYR","BEC","BEF","BEL","BOP","BAD","BRB",
    "BRC","BRE","BRN","BRR","BGJ","BGK","BGL","BUK","HRD","HRK","CUC","ANG",
    "CYP","CSJ","CSK","ECS","ECV","GQE","EEK","XEU","GEK","DDM","DEM","GHC",
    "GHP","GRD","GNE","GNS","GWE","GWP","ITL","ISJ","IEP","ILP","ILR","LAJ",
    "LVL","LVR","LSM","ZAL","LTL","LTT","LUC","LUF","LUL","MGF","MVQ","MLF",
    "MTL","MTP","MRO","MXP","MZE","MZM","NLG","NIC","PEH","PEI","PES","PLZ",
    "PTE","ROK","ROL","CSD","SLL","SKK","SIT","SDG","RHD","ESA","ESB","SDD",
    "SDP","SRG","CHC","TJR","TPE","TRL","TMM","UGS","UGW","UAK","SUR","USS",
    "UYN","UYP","VEB","VEF","VNC","YDD","YUD","YUM","YUN","ZRN","ZRZ","ZMK",
    "ZWC","ZWD","ZWN","ZWR","ZWL","XFO","XRE","XFU"
];

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




const CurrencyRate = model('CurrencyRate', CurrencyRateSchema);

module.exports = CurrencyRate;