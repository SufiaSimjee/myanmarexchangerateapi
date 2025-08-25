const mongoose = require('mongoose');
const seedFuelRates = require('../Models/Seeds/FuelRateSeed');
const seedMetalRates = require("../Models/Seeds/MetalRateSeed");
const seedCurrencyRates = require("../Models/Seeds/CurrencyRateSeed");
const seedUsers = require("../Models/Seeds/UserSeed");

const mongoDbUrl = process.env.MONGODBURL;





async function connectDb() {
    try {
        mongoose.connection.on('error', (dbError) => {
            throw new Error(dbError);
        });

        mongoose.connection.on('connected', async () => {
            await seedFuelRates();
            await seedMetalRates();
            await seedCurrencyRates();
            await seedUsers();
        })

        await mongoose.connect(mongoDbUrl);
        return true;

    } catch (error) {
        console.log(error);
        return false
    }
}

async function closeDb() {
    try{
        mongoose.connection.on('error', (dbError) => {
            throw new Error(dbError);
        });

        mongoose.connection.on('disconnecting', () => {
            console.log('disconnecting')
        });

        mongoose.connection.on('disconnected', () => {
            console.log('disconnected')
        });

        await mongoose.disconnect();
        return true;

    } catch (error) {

        console.log(error);
        return false;
    }
}


module.exports = { connectDb };