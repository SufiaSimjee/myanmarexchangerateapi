const mongoose = require('mongoose');
const mongoDbUrl = process.env.MONGODB_URL;


async function connectDb() {
    try {
        await mongoose.connect(mongoDbUrl);
        console.log("Connected To Database");
        return true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return false;
    }
}

/*async function closeDb() {
    try {
        await mongoose.connection.close();
        console.log("Disconnected From Database");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}*/


module.exports = { connectDb};