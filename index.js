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

const {connectDb} = require('./Services/DbService');
const userRouter = require("./Routers/UserRouter");
const strategy = require("./Auth/JwtStrategy");
const currencyRouter = require("./Routers/CurrencyRouter");
const CurrencyRate = require("./Models/CurrencyRateSchema");
const TutorialRouter = require("./Routers/TutorialRouter");



try{
    const useHttp = process.env.ON_RENDER === "true";

    const app = express();

    app.use(helmet());

    // Set Pug as the view engine
    app.set('view engine', 'pug');
    app.set('views', path.join(__dirname, 'Tutorials'));
    app.use(TutorialRouter);



    //certificate
    let cert;
    if(!useHttp){
        cert = {
            key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "localhost.pem")),
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
    app.use(cors());
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

    let liveExchangeRate = process.env.LIVE_EXCHANGE_RATE === "true";
    let NOTIFICATION_INTERVAL = process.env.NOTIFICATION_INTERVAL || 80;
    if (liveExchangeRate){

        io.on('connection', (_) => {
            let previousHashes = {};

            cron.schedule(`0 */${NOTIFICATION_INTERVAL} * * * *`, async () => {
                const uploader = await CurrencyRate.aggregate([
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
                ]);
                for (let i = 0; i < uploader?.length; i++){
                    const uniqueSources = await CurrencyRate.aggregate([
                        {
                            $match: {
                                uploadedBy: uploader[i].uploadedBy
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
                    ]);

                    for (let j = 0; j < uniqueSources?.length; j++){
                        const uniqueCurrencies = await CurrencyRate.aggregate([
                            {
                                $match: {
                                    uploadedBy: uploader[i].uploadedBy,
                                    source: uniqueSources[j].source
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
                        ]);
                        for (let k = 0; k < uniqueCurrencies?.length; k++){
                            const currencyRate = await CurrencyRate.findOne({
                                uploadedBy: uploader[i].uploadedBy,
                                source: uniqueSources[j].source,
                                currencyCode: uniqueCurrencies[k].currencyCode,
                            }).sort({ uploadedDate: -1 }).lean();

                            const currencyRateString = JSON.stringify(currencyRate);
                            const currentHash = crypto.createHash('sha1').update(currencyRateString).digest('hex').toString();

                            const eventName = `${uploader[i].uploadedBy}_${uniqueSources[j].source}_${uniqueCurrencies[k].currencyCode}`;

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
                        }
                    }
                }
            })
        });


    }


} catch (error) {
    console.log(error);
    process.exit();
}




