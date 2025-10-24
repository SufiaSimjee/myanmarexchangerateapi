const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const rateLimit = require('express-rate-limit');
const compression = require("compression");
const dotenv = require('dotenv').config();
const fs  = require('fs');
const cors = require("cors");
const helmet = require("helmet");
const axios = require('axios');
const moment = require("moment-timezone");

const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const passport = require('passport');
const { join } = require('node:path');
const marked = require('marked').marked;
const { readFileSync } = require('fs');
const cron = require("node-cron");
const crypto = require('crypto');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const { Server } = require("socket.io");
const {connectDb} = require('./Services/DbService');
const strategy = require("./Auth/JwtStrategy");

const userRouter = require("./Routers/UserRouter");
const currencyRouter = require("./Routers/CurrencyRouter");
const CurrencyRate = require("./Models/CurrencyRateSchema");
const TutorialRouter = require("./Routers/TutorialRouter");

const seedCurrencyRates = require("./Models/Seeds/CurrencyRateSeed");
const seedUsers = require("./Models/Seeds/UserSeed");

//swagger
const swaggerOptions = require("./Helpers/SwaggerOptions");




try{
    process.env.TZ = "Asia/Yangon";
    console.log("Today Time: ", new Date().toLocaleString());

    const useHttp = process.env.ON_RENDER === "true";

    const app = express();


    try {
        app.use(cors());
    } catch (error) {
        console.error("Error mounting CORS middleware:", error);
    }

    try {
        app.use(helmet());
    } catch (error) {
        console.error("Error mounting Helmet middleware:", error);
    }

 

    // Set Pug as the view engine
    try{
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, 'Tutorials'));
    } catch (error){
        console.log("Cannot Set Pug As View Engine:", error.message)
    }

    try{
        app.set('trust proxy', (_) => {
            try{
                return true;
            } catch (error){
                console.log(error)
            }
        })
    } catch (error){
        console.log("Cannot Set Trust Proxy To True:", error.message)
    }


    //certificate
    let cert;
    if(!useHttp){
        cert = {
            key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH || "localhost-key.pem")),
            cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH || "localhost.pem"))
        }
    }

    //rate limit
    let rateLimiter;
    try {
        rateLimiter = rateLimit({
            max: 100,
            windowMs: 60 * 60 * 1000,
            message: "Too many request from this IP"
        });
    } catch (error) {
        console.error("Error creating rate limiter:", error);
        rateLimiter = (req, res, next) => next(); // fallback: disable limiter if it fails
    }


    //middleware
    try {
        app.use(compression());
    } catch (error) {
        console.error("Error mounting compression middleware:", error);
    }

    try {
        app.use(rateLimiter);
    } catch (error) {
        console.error("Error mounting rate limiter middleware:", error);
    }


    let accessLogStream;
    try {
        accessLogStream = rfs.createStream('access.log', {
            interval: '1d',
            path: path.join(__dirname, 'log')
        });
    } catch (error) {
        console.error("Error creating access log stream:", error);
        accessLogStream = process.stdout; // fallback so morgan still works
    }


    try {
        app.use(morgan('combined',  { stream: accessLogStream }));

    } catch (error) {
        console.error("Error mounting morgan logger:", error);
    }

    try {
        app.use(express.json());
    } catch (error) {
        console.error("Error mounting express.json middleware:", error);
    }

    try {
        app.use(express.urlencoded({ extended: true }));
    } catch (error) {
        console.error("Error mounting express.urlencoded middleware:", error);
    }


    // register passport strategy
    try{
        passport.use("jwt", strategy);
        app.use(passport.initialize());
        console.log("Registered JWT strategy:", passport._strategy('jwt')?.name);
    } catch (error) {
        console.error("Failed to set up passport JWT (Authentication): ",error.message);
    }

    try{
        app.get('/ping', (req, res) => {
            res.status(200).send("Myanmar Exchange Rate API Working!");
        })
    } catch (error){
        console.log(error)
    }

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


    server.requestTimeout = 120000;
    server.headersTimeout = 120000;
    server.keepAliveTimeout = 120000;
    server.timeout = 120000;


    server.on('timeout', (socket) => {
        console.log('timeout');
        socket.destroy();
    });


    let io;
    try{
        io = new Server(server, {
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
                io.emit("test_notification_event", "sent notification");
                socket.on('disconnect', () => {
                    console.log('user disconnected');
                });

            } catch(error){
                console.log(error);
            }
        });
    } catch(error){
        console.error("Failed to set up Socker IO: ",error.message);
    }



    //route
    try {
        app.use(TutorialRouter);
    } catch (error) {
        console.error("Error mounting TutorialRouter:", error);
    }

    try {
        app.use("/user",userRouter);
    } catch (error) {
        console.error("Error mounting userRouter:", error);
    }


    try {
        app.use("/currency", currencyRouter)
    } catch (error) {
        console.error("Error mounting currencyRouter:", error);
    }



    // Swagger definition
    try{
        const swaggerDocs = swaggerJSDoc(swaggerOptions);
        app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    } catch (error){
        console.log("Failed to add swagger: ",error);
    }


    try{
        app.get('/log',passport.authenticate("jwt", { session: false }), (req, res) => {
            try {
                return res.sendFile(path.join(__dirname, "/log/access.log"));
            } catch(error){
                return res.status(500).json({
                    message: "Unexpected error occurred while fetching log file.",
                    details: process.env.NODE_ENV === "development" ? error.message : undefined
                });
            }
        })
    } catch(error){
        console.log(error);
    }

    server.listen(process.env.PORT, process.env.HOST,async ()=> {
        console.log(`listening on ${process.env.HOST}:${process.env.PORT}`);
        try{
            await connectDb();
            await seedCurrencyRates();
            await seedUsers();
        } catch(error){
            console.log(error);
        }
    });

    let liveExchangeRate = process.env.LIVE_EXCHANGE_RATE === "true";
    let NOTIFICATION_INTERVAL = process.env.NOTIFICATION_INTERVAL || 1;


    try{
        if(liveExchangeRate === true){
            console.log("Scheduling Cron Job");
            let previousHashes = {};
            cron.schedule(`0 */${NOTIFICATION_INTERVAL} * * * *`, async () => {
                console.log("Starting Cron Job");
                await connectDb();
                const uploaderList = await CurrencyRate.aggregate([
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

                let uploader = await uploaderList.next();
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
                    uploader = await uploaderList.next();
                }

                console.log("Ending Cron Job");
            })
        }
    } catch(error){
        console.log("Cannot start live notification feature:", error);
    }

    //cron job to add world gold price
    try {
        cron.schedule("*/5 * * * *", function() {
            console.log("Starting Cron Job to add World Gold Rate from gold-api");
            try {
                axios.get('https://api.gold-api.com/price/XAU')
                    .then(response => {
                        try {
                            console.log(response.data);
                            const WorldGoldRate = new CurrencyRate({
                                currencyCode: "GOLD1OZ",
                                unit: "1",
                                buyRate: response.data?.price,
                                sellRate: response.data?.price,
                                source: "World Metal Price",
                                uploadedDate: moment?.tz(response.data?.updatedAt, "Asia/Yangon").toDate(),
                                uploadedBy: "admin123"
                            });
                            WorldGoldRate?.save().then((docs) => {
                                console.log(docs);
                                console.log("data from gold-api saved!");
                            });
                        } catch (error) {
                            console.log("Failed to retrieve data from gold-api: ", error);
                        }

                    })
                    .catch(error => {
                        console.error('Error fetching data', error);
                    });
            } catch (error) {
                console.log("Failed to execute cron function: ", error);
            }
        });


    } catch(error){
        console.log("Cannot start cron job to retrieve world gold price:", error);
    }

    //cron job to add world silver price
    try {
        cron.schedule("*/6 * * * *", function() {
            console.log("Starting Cron Job to add World Silver Rate from gold-api");
            try {
                axios.get('https://api.gold-api.com/price/XAG')
                    .then(response => {
                        try {
                            console.log(response.data);
                            const WorldGoldRate = new CurrencyRate({
                                currencyCode: "SILVER1OZ",
                                unit: "1",
                                buyRate: response.data?.price,
                                sellRate: response.data?.price,
                                source: "World Metal Price",
                                uploadedDate: moment?.tz(response.data?.updatedAt, "Asia/Yangon").toDate(),
                                uploadedBy: "admin123"
                            });
                            WorldGoldRate?.save().then((docs) => {
                                console.log(docs);
                                console.log("data from gold-api saved!");
                            });
                        } catch (error) {
                            console.log("Failed to retrieve data from gold-api: ", error);
                        }

                    })
                    .catch(error => {
                        console.error('Error fetching data', error);
                    });
            } catch (error) {
                console.log("Failed to execute cron function: ", error);
            }
        });


    } catch(error){
        console.log("Cannot start cron job to retrieve world gold price:", error);
    }

    //cron job to add world copper price
    try {
        cron.schedule("*/7 * * * *", function() {
            console.log("Starting Cron Job to add World Copper Rate from gold-api");
            try {
                axios.get('https://api.gold-api.com/price/HG')
                    .then(response => {
                        try {
                            console.log(response.data);
                            const WorldGoldRate = new CurrencyRate({
                                currencyCode: "COPPER1OZ",
                                unit: "1",
                                buyRate: response.data?.price,
                                sellRate: response.data?.price,
                                source: "World Metal Price",
                                uploadedDate: moment?.tz(response.data?.updatedAt, "Asia/Yangon").toDate(),
                                uploadedBy: "admin123"
                            });
                            WorldGoldRate?.save().then((docs) => {
                                console.log(docs);
                                console.log("data from gold-api saved!");
                            });
                        } catch (error) {
                            console.log("Failed to retrieve data from gold-api: ", error);
                        }

                    })
                    .catch(error => {
                        console.error('Error fetching data', error);
                    });
            } catch (error) {
                console.log("Failed to execute cron function: ", error);
            }
        });


    } catch(error){
        console.log("Cannot start cron job to retrieve world gold price:", error);
    }

    //cron job to add world Palladium price
    try {
        cron.schedule("*/7 * * * *", function() {
            console.log("Starting Cron Job to add World Palladium Rate from gold-api");
            try {
                axios.get('https://api.gold-api.com/price/XPD')
                    .then(response => {
                        try {
                            console.log(response.data);
                            const WorldGoldRate = new CurrencyRate({
                                currencyCode: "PALLADIUM1OZ",
                                unit: "1",
                                buyRate: response.data?.price,
                                sellRate: response.data?.price,
                                source: "World Metal Price",
                                uploadedDate: moment?.tz(response.data?.updatedAt, "Asia/Yangon").toDate(),
                                uploadedBy: "admin123"
                            });
                            WorldGoldRate?.save().then((docs) => {
                                console.log(docs);
                                console.log("data from gold-api saved!");
                            });
                        } catch (error) {
                            console.log("Failed to retrieve data from gold-api: ", error);
                        }

                    })
                    .catch(error => {
                        console.error('Error fetching data', error);
                    });
            } catch (error) {
                console.log("Failed to execute cron function: ", error);
            }
        });


    } catch(error){
        console.log("Cannot start cron job to retrieve world gold price:", error);
    }



} catch (error) {
    console.log("Failed to start api: ", error);
    process.exit(1);
}




