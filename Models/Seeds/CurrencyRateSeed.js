const CurrencyRate = require("../CurrencyRateSchema");
const moment = require("moment");


const CurrencyRates = [
    // Default system entries
    new CurrencyRate({
        currencyName: "US Dollar",
        currencyCode: "USD",
        currencyIcon: "💵",
        unit: 1,
        buyRate: 2100,
        sellRate: 2150,
        source: "Central Bank",
        uploadedDate: moment().subtract(5, "days").toDate(),
        uploadedBy: "System"
    }),
    new CurrencyRate({
        currencyName: "Euro",
        currencyCode: "EUR",
        currencyIcon: "💶",
        unit: 1,
        buyRate: 2300,
        sellRate: 2350,
        source: "Central Bank",
        uploadedDate: moment().subtract(4, "days").toDate(),
        uploadedBy: "System"
    }),
    new CurrencyRate({
        currencyName: "British Pound",
        currencyCode: "GBP",
        currencyIcon: "💷",
        unit: 1,
        buyRate: 2700,
        sellRate: 2750,
        source: "Central Bank",
        uploadedDate: moment().subtract(3, "days").toDate(),
        uploadedBy: "System"
    }),
    new CurrencyRate({
        currencyName: "Japanese Yen",
        currencyCode: "JPY",
        currencyIcon: "💴",
        unit: 1,
        buyRate: 15,
        sellRate: 16,
        source: "Central Bank",
        uploadedDate: moment().subtract(2, "days").toDate(),
        uploadedBy: "System"
    }),

    // Default admin entries
    new CurrencyRate({
        currencyName: "US Dollar",
        currencyCode: "USD",
        currencyIcon: "💵",
        unit: 1,
        buyRate: 4800,
        sellRate: 5000,
        source: "Bank",
        uploadedDate: moment().subtract(1, "days").toDate(),
        uploadedBy: "defaultadmin"
    }),
    new CurrencyRate({
        currencyName: "Euro",
        currencyCode: "EUR",
        currencyIcon: "💶",
        unit: 1,
        buyRate: 4900,
        sellRate: 5100,
        source: "Bank",
        uploadedDate: moment().toDate(),
        uploadedBy: "defaultadmin"
    }),
    new CurrencyRate({
        currencyName: "British Pound",
        currencyCode: "GBP",
        currencyIcon: "💷",
        unit: 1,
        buyRate: 5000,
        sellRate: 5200,
        source: "Facebook Page",
        uploadedDate: moment().subtract(6, "hours").toDate(),
        uploadedBy: "defaultadmin"
    }),
    new CurrencyRate({
        currencyName: "Japanese Yen",
        currencyCode: "JPY",
        currencyIcon: "💴",
        unit: 1,
        buyRate: 50,
        sellRate: 60,
        source: "Myanmar Market Price",
        uploadedDate: moment().subtract(12, "hours").toDate(),
        uploadedBy: "defaultadmin"
    }),

    // Additional variations for testing
    new CurrencyRate({
        currencyName: "US Dollar",
        currencyCode: "USD",
        currencyIcon: "💵",
        unit: 1,
        buyRate: 5000,
        sellRate: 5200,
        source: "Private Bank",
        uploadedDate: moment().subtract(2, "hours").toDate(),
        uploadedBy: "tester"
    }),
    new CurrencyRate({
        currencyName: "Euro",
        currencyCode: "EUR",
        currencyIcon: "💶",
        unit: 1,
        buyRate: 5200,
        sellRate: 5400,
        source: "Private Bank",
        uploadedDate: moment().subtract(1, "hours").toDate(),
        uploadedBy: "tester"
    }),
];

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
