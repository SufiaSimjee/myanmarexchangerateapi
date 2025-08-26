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

const { Server } = require("socket.io");

const {connectDb} = require('./Services/DbService');
const userRouter = require("./Routers/UserRouter");
const strategy = require("./Auth/JwtStrategy");
const currencyRouter = require("./Routers/CurrencyRouter");

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

    //route
    app.use("/user",userRouter);
    app.use("/currency", currencyRouter)

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

    server.listen(process.env.PORT, process.env.HOST,()=> {
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

} catch (error) {
    console.log(error);
    process.exit();
}




