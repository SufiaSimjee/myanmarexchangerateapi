const express = require('express');
const https = require('https');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require("compression");
const dotenv = require('dotenv').config();
const fs  = require('fs');
const cors = require("cors");
const morgan = require('morgan');
const passport = require('passport');
const { join } = require('node:path');
const cron = require("node-cron");
const crypto = require('crypto');

const { Server } = require("socket.io");

const {connectDb} = require('./Services/DbService');
const userRouter = require("./Routers/UserRouter");
const strategy = require("./Auth/JwtStrategy");
const currencyRouter = require("./Routers/CurrencyRouter");
const CurrencyRate = require("./Models/CurrencyRateSchema");



try{
    const app = express();


    //certificate
    const cert = {
        key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
        cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
    }

    //rate limit
    const rateLimiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: "Too many request from this IP"
    });

    //middleware
    app.use(compression());
    app.use(cors());
    app.use(rateLimiter);
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // register passport strategy
    passport.use("jwt", strategy);
    app.use(passport.initialize());
    console.log("Registered JWT strategy:", passport._strategy('jwt')?.name);



    app.get('/', (req, res) => {
        try{
            res.sendFile(join(__dirname, 'README.md'));
        } catch(error){
            console.log(error);
            res.status(500).json({
                message: "An error occurred while processing the request.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    });


    //set-up server
    const server = https.createServer(cert, app);
    const io = new Server(server, {
        cors: { origin: "*" },
        connectionStateRecovery: {}
    });

    app.use((req, res, next) => {
        req.io = io;
        return next();
    });



    io.on('connection', async (socket) => {
      try{
          console.log('a user connected');
          socket.on('disconnect', () => {
              console.log('user disconnected');
          });

      } catch(error){
          console.log(error);
      }
    });

    //route
    app.use("/user",userRouter);
    app.use("/currency", currencyRouter)


    server.listen(process.env.PORT, process.env.HOST,async ()=> {
        console.log(`listening on ${process.env.HOST}:${process.env.PORT}`);

        connectDb().then(result => {
            if (result) {
                console.log("Connected to Database");
            } else {
                console.log("Failed to connect to Database");
            }
        }).catch(err => {
            console.error("Database connection error:", err);
        });
    });

    try{
        let latestCurrencyRatesHash = "";
        cron.schedule("0 */1 * * * *", async function() {
            try{
                console.log("🕒 [Cron] Running currency rates update job...");
                let defaultSource = process.env.DEFAULT_SOURCE|| "testuser"

                const currencyRates = await CurrencyRate.aggregate([
                    // Only include records uploaded by default source
                    { $match: { uploadedBy: defaultSource } },

                    // Sort by uploadedDate descending so the latest comes first
                    { $sort: { uploadedDate: -1 } },

                    // Group by currencyName and take the first document (latest)
                    {
                        $group: {
                            _id: "$currencyName",          // grouping key (currencyName)
                            docId: { $first: "$_id" },     // store original _id
                            currencyName: { $first: "$currencyName" },
                            currencyCode: { $first: "$currencyCode" },
                            currencyIcon: { $first: "$currencyIcon" },
                            unit: { $first: "$unit" },
                            buyRate: { $first: "$buyRate" },
                            sellRate: { $first: "$sellRate" },
                            source: { $first: "$source" },
                            uploadedDate: { $first: "$uploadedDate" },
                            uploadedBy: { $first: "$uploadedBy" }
                        }
                    },

                    // Optional: rename docId back to _id
                    {
                        $addFields: { _id: "$docId" }
                    },

                    // Optional: remove temporary docId
                    {
                        $project: { docId: 0 }
                    }
                ]);

                const currencyRatesString = JSON.stringify(currencyRates);
                const currentHash = crypto.createHash('sha1')
                    .update(currencyRatesString)
                    .digest('hex');

                if (currentHash.toString() !== latestCurrencyRatesHash.toString()) {
                    console.log("Current CurrencyRates Hash:", currentHash);
                    console.log("latestCurrencyRates Hash:", latestCurrencyRatesHash);
                    io.emit("all", currencyRatesString);
                    latestCurrencyRatesHash = currentHash;
                    console.log(`Currency rates updated and emitted to clients.`);
                } else {
                    console.log("No changes detected in currency rates. Skipping emit.");
                }
            } catch (error) {
                console.log("Failed to check and send currency rates error through cron job:", error);
            }
        });
    } catch (error) {
        console.log("Failed to schedule cron job", error);
    }




} catch (error) {
    console.log(error);
    process.exit();
}




