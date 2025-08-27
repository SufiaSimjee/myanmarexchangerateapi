const CurrencyRate = require("../CurrencyRateSchema");
const moment = require("moment-timezone");


const currencyRateJson = [
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4275,
        "sellRate": 4360,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4975,
        "sellRate": 5075,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5755,
        "sellRate": 5875,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3320,
        "sellRate": 3390,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 597,
        "sellRate": 609,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4275.00,
        "sellRate": 4360.00,
        "uploadedDate": "2025-08-27T10:35:28",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4975.00,
        "sellRate": 5075.00,
        "uploadedDate": "2025-08-27T10:35:28",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3320.00,
        "sellRate": 3390.00,
        "uploadedDate": "2025-08-27T10:36:16",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-08-27T10:37:32",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.97,
        "sellRate": 29.55,
        "uploadedDate": "2025-08-27T10:38:30",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1013.00,
        "sellRate": 1033.00,
        "uploadedDate": "2025-08-27T10:39:21",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 597.00,
        "sellRate": 609.00,
        "uploadedDate": "2025-08-27T10:40:02",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.07,
        "sellRate": 3.13,
        "uploadedDate": "2025-08-27T10:40:52",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5755.00,
        "sellRate": 5875.00,
        "uploadedDate": "2025-08-27T10:42:25",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2835.00,
        "uploadedDate": "2025-08-27T10:43:49",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3090.00,
        "sellRate": 3155.00,
        "uploadedDate": "2025-08-27T10:47:47",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 140.00,
        "sellRate": 143.00,
        "uploadedDate": "2025-08-27T10:48:39",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1164.00,
        "sellRate": 1188.00,
        "uploadedDate": "2025-08-27T10:51:24",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.70,
        "sellRate": 49.68,
        "uploadedDate": "2025-08-27T10:53:20",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 549.00,
        "sellRate": 560.00,
        "uploadedDate": "2025-08-27T10:54:26",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 532.00,
        "sellRate": 543.00,
        "uploadedDate": "2025-08-27T10:56:07",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-08-27T10:57:17",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-27T10:57:34",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-08-27T10:57:54",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 132.00,
        "sellRate": 135.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4280.00,
        "sellRate": 4330.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5030.00,
        "sellRate": 5100.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2810.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3380.00,
        "sellRate": 3420.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1030.00,
        "sellRate": 1035.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 595.00,
        "sellRate": 605.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5830.00,
        "sellRate": 5885.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.00,
        "sellRate": 30.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4300.00,
        "sellRate": 4350.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5000.00,
        "sellRate": 5150.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3370.00,
        "sellRate": 3430.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1020.00,
        "sellRate": 1070.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 134.00,
        "sellRate": 136.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 580.00,
        "sellRate": 620.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.00,
        "sellRate": 30.50,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 6000.00,
        "sellRate": 6100.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 2.90,
        "sellRate": 2.90,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    }
]


const CurrencyRates = currencyRateJson.map(rate =>
    new CurrencyRate({
        currencyCode: rate.currencyCode,
        unit: rate.unit,
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
        source: rate.source,
        uploadedDate: moment.tz(rate.uploadedDate, "Asia/Yangon").toDate(),
        uploadedBy: process.env.DEFAULT_ADMIN_USERNAME
    })
);

async function seedCurrencyRates() {
    try {

        let documentCount = await CurrencyRate.countDocuments();
        if(documentCount < 1){
            for (const currency of CurrencyRates) {
                await currency.save();
                console.log(`Saved currency rate: ${currency.id}`);
            }
        } else {
            console.log("Currency rate seeds already exist, skipping seeding.");
        }
        return true

    } catch (err) {
        console.error("Error seeding CurrencyRates:", err);
        return false
    }
}

module.exports = seedCurrencyRates;
