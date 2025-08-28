const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require("compression");
const dotenv = require('dotenv').config();
const fs  = require('fs');
const cors = require("cors");
const helmet = require("helmet")

const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const passport = require('passport');
const { join } = require('node:path');
const marked = require('marked').marked;
const { readFileSync } = require('fs');
const cron = require("node-cron");
const crypto = require('crypto');

const { Server } = require("socket.io");

const {connectDb, closeDb} = require('./Services/DbService');
const userRouter = require("./Routers/UserRouter");
const strategy = require("./Auth/JwtStrategy");
const currencyRouter = require("./Routers/CurrencyRouter");
const CurrencyRate = require("./Models/CurrencyRateSchema");
const TutorialRouter = require("./Routers/TutorialRouter");
const seedFuelRates = require("./Models/Seeds/FuelRateSeed");
const seedMetalRates = require("./Models/Seeds/MetalRateSeed");
const seedCurrencyRates = require("./Models/Seeds/CurrencyRateSeed");
const seedUsers = require("./Models/Seeds/UserSeed");



try{
    const useHttp = process.env.ON_RENDER === "true";

    const app = express();

    app.use(cors());
    app.use(helmet());

    // Set Pug as the view engine
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'Tutorials'));
    app.use(TutorialRouter);



    //certificate
    let cert;
    if(!useHttp){
        cert = {
            key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH || "localhost-key.pem")),
            cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH || "localhost.pem")),
        }
    }

    //rate limit
    const rateLimiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: "Too many request from this IP"
    });

    //middleware
    app.use(compression());
    app.use(rateLimiter);

    const accessLogStream = rfs.createStream('access.log', {
        interval: '1d',
        path: path.join(__dirname, 'log')
    });

    app.use(morgan('combined',  { stream: accessLogStream }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // register passport strategy
    passport.use("jwt", strategy);
    app.use(passport.initialize());
    console.log("Registered JWT strategy:", passport._strategy('jwt')?.name);



    app.get('/', (req, res) => {
        try {
            const markdownPath = join(__dirname, 'README.md');
            const markdown = readFileSync(markdownPath, 'utf-8');
            const htmlContent = marked(markdown);

            res.render('readme', { content: htmlContent });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "An error occurred while processing the request.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    });


    //set-up server
    let server;

    if (useHttp) {
        server = http.createServer(app);
        console.log("Server running over HTTP");
    } else {
        server = https.createServer(cert, app);
        console.log("Server running over HTTPS");
    }


    server.requestTimeout = 60000;
    server.headersTimeout = 65000;
    server.keepAliveTimeout = 60000;
    server.timeout = 120000;


    server.on('timeout', (socket) => {
        console.log('timeout');
        socket.destroy();
    });




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
        let dbConnection = await connectDb();
        await dbConnection.asPromise();
        await seedFuelRates();
        await seedMetalRates();
        await seedCurrencyRates();
        await seedUsers();
        await closeDb(dbConnection);
    });

    let liveExchangeRate = process.env.LIVE_EXCHANGE_RATE === "true";
    let NOTIFICATION_INTERVAL = process.env.NOTIFICATION_INTERVAL || 1;


    try{
        if(liveExchangeRate){
            let previousHashes = {};
            let dbConnection;
            cron.schedule(`0 */${NOTIFICATION_INTERVAL} * * * *`, async () => {
                dbConnection = await connectDb();
                await dbConnection.asPromise();
                const uploaders = await CurrencyRate.aggregate([
                    {
                        $group: {
                            _id: "$uploadedBy"
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            uploadedBy: "$_id"
                        }
                    }
                ]).cursor();

                let uploader = await uploaders.next();
                while (uploader) {
                    const uniqueSources = await CurrencyRate.aggregate([
                        {
                            $match: {
                                uploadedBy: uploader.uploadedBy
                            }
                        },
                        {
                            $group: {
                                _id: "$source"
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                source: "$_id"
                            }
                        }
                    ]).cursor();

                    let uniqueSource = await uniqueSources.next();
                    while (uniqueSource) {
                        const uniqueCurrencies = await CurrencyRate.aggregate([
                            {
                                $match: {
                                    uploadedBy: uploader.uploadedBy,
                                    source: uniqueSource.source
                                }
                            },
                            {
                                $group: {
                                    _id: "$currencyCode",
                                    currencyName: { $first: "$currencyName" }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    currencyCode: "$_id",
                                    currencyName: 1
                                }
                            }
                        ]).cursor();

                        let uniqueCurrency = await uniqueCurrencies.next();
                        while (uniqueCurrency){
                            let currencyRate = await CurrencyRate.findOne({
                                uploadedBy: uploader.uploadedBy,
                                source: uniqueSource.source,
                                currencyCode: uniqueCurrency.currencyCode,
                            }).sort({ uploadedDate: -1 }).select('-__v').lean();


                            const currencyRateString = JSON.stringify(currencyRate);
                            const currentHash = crypto.createHash('sha1').update(currencyRateString).digest('hex').toString();

                            const eventName = `${uploader.uploadedBy}_${uniqueSource.source}_${uniqueCurrency.currencyCode}`;

                            if (previousHashes[eventName] === undefined) {
                                previousHashes = {
                                    ...previousHashes,
                                    [eventName]: currentHash
                                };
                                console.log(`Emitting '${eventName}' for the first time.`);
                                io.emit(eventName, currencyRateString);
                            }
                            else if (previousHashes[eventName] !== currentHash) {
                                console.log(`Hash changed for '${eventName}'. Old: ${previousHashes[eventName]}, New: ${currentHash}`);
                                previousHashes[eventName] = currentHash;
                                console.log(`Emitting '${eventName}' with updated data.`);
                                io.emit(eventName, currencyRateString);
                            }
                            else {
                                console.log(`No change for '${eventName}', skipping emit.`);
                            }

                            uniqueCurrency = await uniqueCurrencies.next();
                        }

                        uniqueSource = await uniqueSources.next();
                    }
                    uploader = await uploaders.next();
                }

                await closeDb(dbConnection);
            })
        }
    } catch(error){
        console.log("Cannot start live notification feature:", error);
    }





} catch (error) {
    console.log("Failed to start api: ", error);
    process.exit();
}




