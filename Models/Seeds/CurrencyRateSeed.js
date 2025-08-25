const CurrencyRate = require("../CurrencyRateSchema");


const CurrencyRates = [
    new CurrencyRate({
        currencyName: "US Dollar",
        currencyCode: "USD",
        currencyIcon: "💵",
        unit: "1",
        buyRate: 2100,
        sellRate: 2150,
        source: "Central Bank",
        uploadedDate: new Date(),
        uploadedBy: "System"
    }),
    new CurrencyRate({
        currencyName: "Euro",
        currencyCode: "EUR",
        currencyIcon: "💶",
        unit: "1",
        buyRate: 2300,
        sellRate: 2350,
        source: "Central Bank",
        uploadedDate: new Date(),
        uploadedBy: "System"
    }),
    new CurrencyRate({
        currencyName: "British Pound",
        currencyCode: "GBP",
        currencyIcon: "💷",
        unit: "1",
        buyRate: 2700,
        sellRate: 2750,
        source: "Central Bank",
        uploadedDate: new Date(),
        uploadedBy: "System"
    }),
    new CurrencyRate({
        currencyName: "Japanese Yen",
        currencyCode: "JPY",
        currencyIcon: "💴",
        unit: "1",
        buyRate: 15,
        sellRate: 16,
        source: "Central Bank",
        uploadedDate: new Date(),
        uploadedBy: "System"
    })
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
