const mongoose = require('mongoose');
const mongoDbUrl = process.env.MONGODB_URL;


async function connectDb() {
    try {
        const conn = await mongoose.connect(mongoDbUrl, {
            maxPoolSize: 10,
            minPoolSize: 1,
            serverSelectionTimeoutMS: 10000,
        });

        console.log("Connected To Database");
        return conn.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return null;
    }
}

async function closeDb(connection) {
    try {
        await connection.close();
        console.log("Disconnected From Database");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = { connectDb, closeDb};