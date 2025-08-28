const mongoose = require('mongoose');
const mongoDbUrl = process.env.MONGODB_URL;






async function connectDb() {
    try {
        const conn = await mongoose.connect(mongoDbUrl, {
            maxPoolSize: 10, // pool size for concurrent connections
            minPoolSize: 1,  // keep at least one alive
            serverSelectionTimeoutMS: 10000, // 10 sec timeout
        });

        console.log("Connected To Database");
        return conn.connection; // return the active connection
    } catch (error) {
        console.error("MongoDB connection error:", error);
        return null;
    }
}

async function closeDb(connection) {
    try {
        await connection.close();
        console.log("Disconnected from database");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}




module.exports = { connectDb, closeDb};