const MetalRate = require("../MetalRateSchema");


const MetalRates = [
    new MetalRate({
        metalName: "Gold",
        metalCode: "GLD",
        metalIcon: "",
        buyRate: 120000,
        sellRate: 121500,
        measurementUnit: "per gram",
        source: "Yangon Gold Market",
        location: "Yangon",
        uploadedBy: "System"
    }),
    new MetalRate({
        metalName: "Silver",
        metalCode: "SLV",
        metalIcon: "",
        buyRate: 1500,
        sellRate: 1700,
        measurementUnit: "per gram",
        source: "Yangon Silver Exchange",
        location: "Mandalay",
        uploadedBy: "System"
    }),
    new MetalRate({
        metalName: "Platinum",
        metalCode: "PLT",
        metalIcon: "",
        buyRate: 85000,
        sellRate: 87000,
        measurementUnit: "per gram",
        source: "Platinum Association",
        location: "Naypyidaw",
        uploadedBy: "System"
    }),
    new MetalRate({
        metalName: "Gold (Kg)",
        metalCode: "GLDKG",
        metalIcon: "",
        buyRate: 120000000,
        sellRate: 121500000,
        measurementUnit: "per kg",
        source: "Yangon Gold Market",
        location: "Yangon",
        uploadedBy: "System"
    })
];

async function seedMetalRates() {
    try {

        let documentCount = await MetalRate.countDocuments();

        if(documentCount < 1){
            for (const metal of MetalRates) {
                await metal.save();
                console.log(`Saved metal rate: ${metal.id}`);
            }
        } else {
            console.log("Metal rate seeds already exist, skipping seeding.");
        }

    } catch (err) {
        console.error(" Error seeding MetalRates:", err);
    }
}

module.exports = seedMetalRates;
