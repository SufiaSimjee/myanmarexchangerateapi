const mongoose = require('mongoose');
const mongoDbUrl = process.env.MONGODB_URL;






async function connectDb() {
    try {
        const mainConnection = await mongoose.createConnection(mongoDbUrl);
        console.log("Main DB connected");
        return mainConnection; // Return the connection for models
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function closeDb(connection) {
    try {
        await connection.close();
        console.log("Main DB disconnected");
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = { connectDb, closeDb };