const FuelRate = require("../FuelRateSchema");



const FuelRates = [
    new FuelRate({
        fuelName: "Petrol",
        fuelCode: "PET",
        fuelIcon: "",
        rate: 2500,
        measurementUnit: "per liter",
        source: "Gov Station",
        location: "Yangon",
        uploadedBy: "System"
    }),
    new FuelRate({
        fuelName: "Diesel",
        fuelCode: "DSL",
        fuelIcon: "",
        rate: 2300,
        measurementUnit: "per liter",
        source: "Gov Station",
        location: "Mandalay",
        uploadedBy: "System"
    }),
    new FuelRate({
        fuelName: "Octane",
        fuelCode: "OCT",
        fuelIcon: "",
        rate: 2800,
        measurementUnit: "per liter",
        source: "Private Station",
        location: "Naypyidaw",
        uploadedBy: "System"
    }),
    new FuelRate({
        fuelName: "CNG",
        fuelCode: "CNG",
        fuelIcon: "",
        rate: 1200,
        measurementUnit: "per gallon",
        source: "Gov Station",
        location: "Yangon",
        uploadedBy: "System"
    })
];

async function seedFuelRates() {
    try {

        let documentCount = await FuelRate.countDocuments();

        if(documentCount.countDocuments < 1){
            for (const fuel of FuelRates) {
                await fuel.save();
                console.log(`Saved fuel rate: ${fuel._id}`);
            }
        } else {
            console.log("Fuel rate seeds already exist, skipping seeding.");
        }
    } catch (err) {
        console.error("Error seeding FuelRates:", err);
    }
}

module.exports = seedFuelRates;