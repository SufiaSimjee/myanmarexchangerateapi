const passport = require("passport");
const express = require("express");
const expressCache = require("cache-express");
const ObjectId = require('mongoose').Types.ObjectId;

const moment = require("moment-timezone");
const currencyRouter = express.Router();
const CurrencyRate = require("../Models/CurrencyRateSchema");


let currencyRateUpdateTracker = 0;
let defaultSource = process.env.DEFAULT_SOURCE;
let defaultUploader = process.env.DEFAULT_UPLOADER;

let cacheTime = 3600000; //60 Minutes


/**
 * @swagger
 * /currency/uploaderList:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve a paginated list of unique uploader
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: "Number of records to skip (for pagination)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: "Maximum number of records to return"
 *     responses:
 *       200:
 *         description: "Successfully retrieved uploader list"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 skip:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *       400:
 *         description: "Invalid query parameters (skip or limit)"
 *       404:
 *         description: No uploader found
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/uploaderList", async (req, res) => {
    try {
        let { skip, limit } = req.query;

        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 10;

        if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
            return res.status(400).json({
                message: "'skip' must be 0 or greater and 'limit' must be at least 1."
            });
        }


        const totalCount = await CurrencyRate.distinct("uploadedBy").then(arr => arr.length);

        if (totalCount === 0) {
            return res.status(404).json({
                message: "No uploader found in the database.",
                totalCount: 0
            });
        }

        const uniqueUploader = await CurrencyRate.aggregate([
            {
                $group: {
                    _id: "$uploadedBy"
                }
            },
            {
                $project: {
                    _id: 0,
                    username: "$_id"
                }
            },
            {
                $sort: { username: 1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);


        if (!uniqueUploader) {
            return res.status(404).json({
                message: "No uploader found in the database for the given pagination.",
                totalCount: totalCount,
                skip: skip,
                limit: limit,
            });
        }

        return res.status(200).json({
            message: "Uploader List retrieved successfully.",
            totalCount: totalCount,
            skip: skip,
            limit: limit,
            data: uniqueUploader,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching the uploader list.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


/**
 * @swagger
 * /currency/sourceList:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve a paginated list of unique sources for a specific uploader
 *     parameters:
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         description: "Username of the uploader (optional, defaults to system default)"
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of records to skip (for pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: Successfully retrieved source list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SourceListResponse'
 *       400:
 *         description: Invalid query parameters (skip or limit)
 *       404:
 *         description: No sources found
 *       500:
 *         description: Internal server error
 */

currencyRouter.get("/sourceList", async (req, res) => {
    try {
        let {uploader, skip, limit} = req.query;

        if (!uploader) {
            uploader = defaultUploader;
        }

        // Validate pagination parameters
        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 10;

        if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
            return res.status(400).json({
                message: "'skip' must be 0 or greater and 'limit' must be at least 1."
            });
        }


        const totalCount = await CurrencyRate.distinct("source", { uploadedBy: { $regex: `^${uploader}$`, $options: 'i' } }).then(arr => arr.length);

        if (totalCount === 0) {
            return res.status(404).json({
                message: "No sources found in the database.",
                uploader: uploader,
                totalCount: 0
            });
        }

        const uniqueSources = await CurrencyRate.aggregate([
            {
                $match: {
                    uploadedBy: { $regex: `^${uploader}$`, $options: 'i' }
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
                    sourceName: "$_id"
                }
            },
            {
                $sort: { sourceName: 1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        if (!uniqueSources) {
            return res.status(404).json({
                message: "No sources found in the database for the given pagination.",
                totalCount: totalCount,
                skip: skip,
                limit: limit,
                uploader: uploader
            });
        }

        return res.status(200).json({
            message: "Sources retrieved successfully.",
            uploader: uploader,
            totalCount: totalCount,
            skip: skip,
            limit: limit,
            data: uniqueSources,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching the source list.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

/**
 * @swagger
 * /currency/currencyList:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve a paginated list of currencies filtered by source and uploader
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: "Name of the source (optional, defaults to system default)"
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         description: "Username of the uploader (optional, defaults to system default)"
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: "Number of records to skip (for pagination)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: Successfully retrieved currency list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploader:
 *                   type: string
 *                 source:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 skip:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       currencyCode:
 *                         type: string
 *                       currencyName:
 *                         type: string
 *       400:
 *         description: Invalid query parameters (skip or limit)
 *       404:
 *         description: No currencies found
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/currencyList", async (req, res) => {
    try {
        let {source, uploader, skip, limit} = req.query;

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        // Validate pagination parameters
        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 10;

        if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
            return res.status(400).json({
                message: "'skip' must be 0 or greater and 'limit' must be at least 1."
            });
        }



        const totalCount = await CurrencyRate.distinct("currencyCode", {
            source: { $regex: `^${source}$`, $options: 'i' },
            uploadedBy: { $regex: `^${uploader}$`, $options: 'i' }
        }).then(arr => arr.length);



        if (totalCount === 0) {
            return res.status(404).json({
                message: "No currencies found in the database.",
                uploader: uploader,
                source: source,
                totalCount: 0
            });
        }


        const uniqueCurrencies = await CurrencyRate.aggregate([
            {
                $match: {
                    source: { $regex: `^${source}$`, $options: 'i' },      // case-insensitive match
                    uploadedBy: { $regex: `^${uploader}$`, $options: 'i' } // case-insensitive match
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
            },
            {
                $sort: { currencyCode: 1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        if (!uniqueCurrencies) {
            return res.status(404).json({
                message: "No currencies found in the database for the given pagination.",
                uploader: uploader,
                source: source,
                totalCount: totalCount,
                skip: skip,
                limit: limit,
            });
        }

        return res.status(200).json({
            message: "Currencies retrieved successfully.",
            uploader: uploader,
            source: source,
            totalCount: totalCount,
            skip: skip,
            limit: limit,
            data: uniqueCurrencies,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching the currency list.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

/**
 * @swagger
 * /currency/findUploader&Source/{currencyCode}:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve a paginated list of uploader & source combinations for a specific currency
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: Currency code to search for
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           minimum: 0
 *         description: Number of records to skip (for pagination)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Maximum number of records to return
 *     responses:
 *       200:
 *         description: Successfully retrieved uploader and source list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 skip:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       currencyCode:
 *                         type: string
 *                       currencyName:
 *                         type: string
 *                       uploadedBy:
 *                         type: string
 *                       source:
 *                         type: string
 *       400:
 *         description: Invalid query parameters (skip or limit)
 *       404:
 *         description: No currency uploader and source found
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/findUploader&Source/:currencyCode", async (req, res) => {
    try {
        let {currencyCode} = req.params;

        let { skip, limit } = req.query;

        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 10;

        if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
            return res.status(400).json({
                message: "'skip' must be 0 or greater and 'limit' must be at least 1."
            });
        }


        const totalCount = await CurrencyRate.distinct("uploadedBy", { currencyCode: { $regex: `^${currencyCode}$`, $options: 'i' } })
            .then(uploaderArr => {
                return CurrencyRate.distinct("source", { currencyCode: { $regex: `^${currencyCode}$`, $options: 'i' } })
                    .then(sourceArr => uploaderArr.length * sourceArr.length);
            });

        if (totalCount === 0) {
            return res.status(404).json({
                message: "No currency uploader and source found in the database.",
                totalCount: 0
            });
        }

        const uniqueUploaderAndSource = await CurrencyRate.aggregate([
            {
                $match: {
                    currencyCode: { $regex: `^${currencyCode}$`, $options: 'i' } // case-insensitive match
                }
            },
            {
                $group: {
                    _id: { uploadedBy: "$uploadedBy", source: "$source" },
                    currencyCode: { $first: "$currencyCode" },
                    currencyName: { $first: "$currencyName" }
                }
            },
            {
                $project: {
                    _id: 0,
                    currencyCode: 1,
                    currencyName: 1,
                    uploadedBy: "$_id.uploadedBy",
                    source: "$_id.source"
                }
            },
            {
                $sort: { uploadedBy: 1, source: 1 }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]);

        if (!uniqueUploaderAndSource) {
            return res.status(404).json({
                message: "No currency uploader and source found in the database for the given pagination.",
                totalCount: totalCount,
                skip: skip,
                limit: limit
            });
        }

        return res.status(200).json({
            message: "Currency uploader and source retrieved successfully.",
            totalCount: totalCount,
            skip: skip,
            limit: limit,
            data: uniqueUploaderAndSource,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching the currency uploader and source.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

/**
 * @swagger
 * /currency/add:
 *   post:
 *     tags:
 *       - Exchange Rates
 *     summary: Add a new currency exchange rate
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currencyCode
 *               - unit
 *               - buyRate
 *               - sellRate
 *               - uploadedDate
 *               - source
 *             properties:
 *               currencyCode:
 *                 type: string
 *                 description: ISO code of the currency
 *               unit:
 *                 type: integer
 *                 description: Unit of the currency
 *               buyRate:
 *                 type: number
 *                 description: Buy rate of the currency
 *               sellRate:
 *                 type: number
 *                 description: Sell rate of the currency
 *               uploadedDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time the rate was uploaded ("YYYY-MM-DD HH:mm:ss" or ISO format)
 *               source:
 *                 type: string
 *                 description: Source of the exchange rate
 *     responses:
 *       201:
 *         description: Exchange rate added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     currencyCode:
 *                       type: string
 *                     unit:
 *                       type: integer
 *                     buyRate:
 *                       type: number
 *                     sellRate:
 *                       type: number
 *                     source:
 *                       type: string
 *                     uploadedDate:
 *                       type: string
 *                       format: date-time
 *                     uploadedBy:
 *                       type: string
 *       400:
 *         description: Missing required fields or invalid date format
 *       409:
 *         description: Exchange rate already exists
 *       500:
 *         description: Internal server error
 */
currencyRouter.post("/add", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try{
        let { currencyCode, unit, buyRate, sellRate, uploadedDate, source } = req.body;
        let {username} = req.user


        if (!currencyCode || !unit || !buyRate || !sellRate || !uploadedDate || !source) {
            return res.status(400).json({
                message: "These fields are required: currencyCode, unit, buyRate, sellRate, uploadedDate, source.",
            });
        }


        // Validate uploadedDate format with time included
        if (!moment(uploadedDate, "YYYY-MM-DD HH:mm:ss", true).isValid() && !moment(uploadedDate, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({
                message: "Invalid uploadedDate format. Please use 'YYYY-MM-DD HH:mm:ss' or ISO format.",
            });
        }

        // Convert uploadedDate to a moment object (assuming it's in "YYYY-MM-DD HH:mm:ss" or ISO format)
        const unformattedDate = moment.tz(uploadedDate, "Asia/Yangon");

        // Get current time in Yangon
        const currentDate = moment.tz("Asia/Yangon");

       // Check if uploadedDate is in the future
        if (unformattedDate.isAfter(currentDate)) {
            return res.status(400).json({
                message: "Uploaded date cannot be in the future!",
            });
        }

        const formattedDate = unformattedDate.toDate();


        const existingRate = await CurrencyRate.findOne({
            $and: [
                { currencyCode: currencyCode.toUpperCase()},
                { unit: unit },
                { buyRate: buyRate },
                { sellRate: sellRate },
                { source: { $regex: `^${source}$`, $options: 'i' }},
                { uploadedDate: formattedDate },
                { uploadedBy: username}
            ]
        });

        if (existingRate) {
            return res.status(409).json({ // 409 Conflict
                message: `An exchange rate for ${currencyCode.toUpperCase()} on ${uploadedDate} by ${username} already exists.`,
            });
        }

        const newRate = new CurrencyRate({
            currencyCode: currencyCode.toUpperCase(),
            unit: unit,
            buyRate: buyRate,
            sellRate: sellRate,
            source: source,
            uploadedDate: uploadedDate,
            uploadedBy: username,
        });

        const result = await newRate.save();

        currencyRateUpdateTracker++;

        try{
            req.io.emit(`${result.uploadedBy}_${result.source}_${result.currencyCode}`, JSON.stringify(result));
        } catch (error) {
            console.log("Failed to send notification: ", error.message);
        }

        return res.status(201).json({ // 201 Created
            message: `Exchange rate for ${currencyCode} added successfully.`,
            totalCount: 1,
            data: result,
        });


    } catch (error) {
        console.error("Add Exchange Rate Error:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while adding the exchange rate.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
})


/**
 * @swagger
 * /currency/addMany:
 *   post:
 *     tags:
 *       - Exchange Rates
 *     summary: Add multiple currency exchange rates at once
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - currencyCode
 *                 - unit
 *                 - buyRate
 *                 - sellRate
 *                 - uploadedDate
 *                 - source
 *               properties:
 *                 currencyCode:
 *                   type: string
 *                   description: The 3-letter ISO currency code
 *                   example: "USD"
 *                 unit:
 *                   type: number
 *                   description: Unit of currency (e.g., 1, 100)
 *                   example: 1
 *                 buyRate:
 *                   type: number
 *                   description: Buy rate of the currency
 *                   example: 2100.5
 *                 sellRate:
 *                   type: number
 *                   description: Sell rate of the currency
 *                   example: 2150.25
 *                 uploadedDate:
 *                   type: string
 *                   format: date-time
 *                   description: Date of the exchange rate (Yangon timezone)
 *                   example: "2025-09-03 10:00:00"
 *                 source:
 *                   type: string
 *                   description: Source of the currency rate
 *                   example: "defaultSource"
 *     responses:
 *       201:
 *         description: Exchange rates added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploader:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CurrencyRate'
 *       400:
 *         description: Missing or invalid fields in request body
 *       409:
 *         description: Exchange rate already exists for given currency, date, and uploader
 *       500:
 *         description: Internal server error
 */

currencyRouter.post("/addMany", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        let currencyRates = req.body;
        let newRates = [];
        let { username } = req.user;

        if (!currencyRates || !Array.isArray(currencyRates) || currencyRates.length === 0) {
            return res.status(400).json({ message: "No currency rates provided." });
        }

        for (let currency of currencyRates) {
            let { currencyCode, unit, buyRate, sellRate, uploadedDate, source } = currency;

            if (!currencyCode || !unit || !buyRate || !sellRate || !uploadedDate || !source) {
                return res.status(400).json({
                    message: `Currency ${currencyCode}: These fields are required: currencyCode, unit, buyRate, sellRate, uploadedDate, source.`,
                });
            }

            // Validate uploadedDate
            if (!moment(uploadedDate, "YYYY-MM-DD HH:mm:ss", true).isValid() &&
                !moment(uploadedDate, moment.ISO_8601, true).isValid()) {
                return res.status(400).json({
                    message: `Currency ${currencyCode}: Invalid uploadedDate format. Please use 'YYYY-MM-DD HH:mm:ss' or ISO format.`,
                });
            }

            const unformattedDate = moment.tz(uploadedDate, "Asia/Yangon");
            const currentDate = moment.tz("Asia/Yangon");

            if (unformattedDate.isAfter(currentDate)) {
                return res.status(400).json({ message: `Currency ${currencyCode}: Uploaded date cannot be in the future!` });
            }

            const formattedDate = unformattedDate.toDate();

            const existingRate = await CurrencyRate.findOne({
                currencyCode: currencyCode.toUpperCase(),
                unit,
                buyRate,
                sellRate,
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: formattedDate,
                uploadedBy: username
            });

            if (existingRate) {
                return res.status(409).json({
                    message: `An exchange rate for ${currencyCode} on ${uploadedDate} by ${username} already exists.`,
                });
            }

            newRates.push(new CurrencyRate({
                currencyCode: currencyCode.toUpperCase(),
                unit,
                buyRate,
                sellRate,
                source,
                uploadedDate: formattedDate,
                uploadedBy: username,
            }));
        }


        const result = await CurrencyRate.bulkSave(newRates);

        currencyRateUpdateTracker = currencyRateUpdateTracker + result?.insertedCount;

        const insertedIds = Object.values(result.insertedIds); // ["68bbd0bd7bf8b473bfc26b78", "68bbd0bd7bf8b473bfc26b7a"]

        const insertedDocs = await CurrencyRate.find({
            _id: { $in: insertedIds }
        });


        try{
            insertedDocs.forEach(doc => {
                req.io.emit(`${doc.uploadedBy}_${doc.source}_${doc.currencyCode}`, JSON.stringify(doc));
            });
        } catch (error) {
            console.log("Failed to send notification: ", error.message);
        }

        return res.status(201).json({
            message: `${result?.insertedCount} exchange rate(s) added successfully.`,
            uploader: username,
            totalCount: result?.insertedCount,
            data: insertedDocs,
        });

    } catch (error) {
        console.error("Add Exchange Rate Error (Bulk) :", error);
        return res.status(500).json({
            message: "An unexpected error occurred while adding the exchange rate in bulk.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


/**
 * @swagger
 * /currency/delete/{id}:
 *   delete:
 *     tags:
 *       - Exchange Rates
 *     summary: Delete a currency exchange rate by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the currency exchange rate to delete
 *     responses:
 *       204:
 *         description: Currency exchange rate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid ID format
 *       403:
 *         description: User does not have permission to delete this exchange rate
 *       404:
 *         description: No currency exchange rate found with the provided ID
 *       500:
 *         description: Internal server error
 */
currencyRouter.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        let {username} = req.user

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: `Invalid ID format: '${id}'. Please provide a valid MongoDB ObjectId in the request URL.`
            });
        }

        // Find the currency rate by ID
        const exchangeRate = await CurrencyRate.findById(id).lean();

        if (!exchangeRate) {
            return res.status(404).json({
                message: `No currency exchange rate found with ID '${id}'.`,
                totalCount: 0
            });
        }

        if(username !== process.env.DEFAULT_ADMIN_USERNAME){
            if (exchangeRate.uploadedBy !== username) {
                return res.status(403).json({
                    message: "You do not have permission to delete an exchange rate uploaded by another user."
                });
            }
        }

        // Delete the currency rate
        await CurrencyRate.findByIdAndDelete(id);

        // Update tracker
        if (currencyRateUpdateTracker > -1) {
            currencyRateUpdateTracker--;
        }

        return res.status(204).json({ // 204 deleted
            message: `Currency exchange rate with ID '${id}' has been deleted successfully.`
        });

    } catch (error) {
        console.error("Error deleting currency rate:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while deleting the currency rate.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

/**
 * @swagger
 * /currency/{id}:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve a currency exchange rate by ID with percentage change
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the currency exchange rate
 *     responses:
 *       200:
 *         description: Currency exchange rate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 uploader:
 *                   type: string
 *                 source:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Currency exchange rate not found
 *       500:
 *         description: Internal server error
 */
currencyRouter.get('/:id', expressCache({ timeOut: cacheTime, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}),async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: `Invalid ID format: '${id}'. Please provide a valid MongoDB ObjectId in the request URL.`
            });
        }

        // Find the currency rate by ID
        const exchangeRate = await CurrencyRate.findById(id).select('-__v');

        if (!exchangeRate) {
            return res.status(404).json({
                message: `No currency exchange rate found with ID '${id}'.`,
                totalCount: 0
            });
        }

        const rateWithChange = await exchangeRate.getPercentageChange();


        return res.status(200).json({ // 200 OK
            message: `Currency exchange rate with ID '${id}' has been retrieve successfully.`,
            totalCount: 1,
            uploader: exchangeRate.uploadedBy,
            source: exchangeRate.source,
            data: rateWithChange
        });

    } catch (error) {
        console.error("Error retrieving currency rate:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while retrieving the currency rate.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

/**
 * @swagger
 * /currency/{currencyCode}/{date}/highest:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve the highest exchange rate for a specific currency on a given date
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: ISO code of the currency (cannot be "ALL")
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in 'YYYY-MM-DD' format
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: "Source of the exchange rate (default: defaultSource)"
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         description: "Uploader of the exchange rate (default: defaultUploader)"
 *     responses:
 *       200:
 *         description: Highest exchange rate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploader:
 *                   type: string
 *                 source:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request (e.g., currencyCode = "ALL" or invalid date format)
 *       404:
 *         description: No highest exchange rate found for the given date
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/:currencyCode/:date/highest", expressCache({ timeOut: cacheTime, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res)=>{
    try{
        const { currencyCode, date } = req.params;
        let {source, uploader} = req.query;

        const normalizedCode = currencyCode.trim().toUpperCase();

        if (normalizedCode === "ALL") {
            return res.status(400).json({
                message: "Please select a specific currency to get the highest exchange rate for the given date.",
                uploader,
                source,
                totalCount: 0
            });
        }

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        const dateString = date || moment().tz("Asia/Yangon").format("YYYY-MM-DD");


        // Validate date format (YYYY-MM-DD)
        if (!moment(dateString, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
                message: "The date must be in 'YYYY-MM-DD' format. Example: 2025-08-25."
            });
        }

        const startOfDay = moment.tz(dateString, "YYYY-MM-DD", "Asia/Yangon").startOf("day").toDate();
        const endOfDay = moment.tz(dateString, "YYYY-MM-DD", "Asia/Yangon").endOf("day").toDate();


        let currencyRate = await CurrencyRate.findOne({
            currencyCode: normalizedCode,
            uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
            source: { $regex: `^${source}$`, $options: 'i' },
            uploadedDate: { $gte: startOfDay, $lte: endOfDay }
        }).sort({ sellRate: -1 }).select('-__v');


        if (!currencyRate) {
            return res.status(404).json({
                message: `No highest exchange rate found for ${normalizedCode} on ${date}.`,
                uploader: uploader,
                source: source,
                totalCount: 0,
            });
        }

        return res.status(200).json({
            message: `Highest exchange rate for ${normalizedCode} on ${dateString} retrieved successfully.`,
            uploader: uploader,
            source: source,
            totalCount: 1,
            data: currencyRate
        });


    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching the highest exchange rate for the selected date.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


/**
 * @swagger
 * /currency/{currencyCode}/{date}/lowest:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve the lowest exchange rate for a specific currency on a given date
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: ISO code of the currency (cannot be "ALL")
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in 'YYYY-MM-DD' format
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: "Source of the exchange rate (default: defaultSource)"
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         description: "Uploader of the exchange rate (default: defaultUploader)"
 *     responses:
 *       200:
 *         description: Lowest exchange rate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploader:
 *                   type: string
 *                 source:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid request (e.g., currencyCode = "ALL" or invalid date format)
 *       404:
 *         description: No lowest exchange rate found for the given date
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/:currencyCode/:date/lowest", expressCache({timeOut: cacheTime, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => {console.log(`Cache removed for key: ${key}`);}}),
    async (req, res) => {
        try {
            const { currencyCode, date } = req.params;
            let { source, uploader } = req.query;

            const normalizedCode = currencyCode.trim().toUpperCase();

            if (normalizedCode === "ALL") {
                return res.status(400).json({
                    message: "Please select a specific currency to get the lowest exchange rate for the given date.",
                    uploader,
                    source,
                    totalCount: 0
                });
            }

            if (!source) {
                source = defaultSource;
            }

            if (!uploader) {
                uploader = defaultUploader;
            }

            const dateString = date || moment().tz("Asia/Yangon").format("YYYY-MM-DD");

            if (!moment(dateString, "YYYY-MM-DD", true).isValid()) {
                return res.status(400).json({
                    message: "The date must be in 'YYYY-MM-DD' format. Example: 2025-08-25."
                });
            }

            const startOfDay = moment.tz(dateString, "YYYY-MM-DD", "Asia/Yangon").startOf("day").toDate();
            const endOfDay = moment.tz(dateString, "YYYY-MM-DD", "Asia/Yangon").endOf("day").toDate();

            let currencyRate = await CurrencyRate.findOne({
                currencyCode: normalizedCode,
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ sellRate: 1 }).select('-__v');

            if (!currencyRate) {
                return res.status(404).json({
                    message: `No lowest exchange rate found for ${normalizedCode} on ${date}.`,
                    uploader,
                    source,
                    totalCount: 0,
                });
            }

            return res.status(200).json({
                message: `Lowest exchange rate for ${normalizedCode} on ${dateString} retrieved successfully.`,
                uploader: uploader,
                source: source,
                totalCount: 1,
                data: currencyRate
            });

        } catch (error) {
            return res.status(500).json({
                message: "An unexpected error occurred while fetching the lowest exchange rate for the selected date.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
);

/**
 * @swagger
 * /currency/{currencyCode}/latest:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve the latest exchange rate(s) for a currency or all currencies
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         required: true
 *         schema:
 *           type: string
 *         description: ISO code of the currency (use "ALL" for all currencies)
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: "Source of the exchange rate (default: defaultSource)"
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         description: "Uploader of the exchange rate (default: defaultUploader)"
 *     responses:
 *       200:
 *         description: Latest exchange rate retrieved successfully
 *       404:
 *         description: No latest exchange rate found
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/:currencyCode/latest",expressCache({ timeOut: cacheTime, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
    try {
        const { currencyCode } = req.params;
        let {source, uploader} = req.query;

        const normalizedCode = currencyCode.trim().toUpperCase();


        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }


        if(normalizedCode !== "ALL") {
            let currencyRate = await CurrencyRate.findOne({
                currencyCode: normalizedCode,
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' }
            }).sort({ uploadedDate: -1 }).select('-__v');

            if (!currencyRate) {
                return res.status(404).json({
                    message: `No latest exchange rate found for currency '${normalizedCode}' from the default source.`,
                    uploader: uploader,
                    source: source,
                    totalCount: 0
                });
            }

            try{
                currencyRate = await currencyRate.getPercentageChange();
            } catch (error) {
                console.log("Failed to get percentage change: ", error);
            }


            return res.status(200).json({
                message: "Latest exchange rate retrieved successfully.",
                uploader: uploader,
                source: source,
                totalCount: 1,
                data: currencyRate
            });
        } else {
            let currencyRates = await CurrencyRate.aggregate([
                // Only include records uploaded by default source
                {  $match: {
                        source: { $regex: `^${source}$`, $options: 'i' },      // case-insensitive match
                        uploadedBy: { $regex: `^${uploader}$`, $options: 'i' } // case-insensitive match

                }},

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
                        uploadedBy: { $first: "$uploadedBy" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" }
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

            if (!currencyRates) {
                return res.status(404).json({
                    message: `No latest exchange rate found.`,
                    uploader: uploader,
                    source: source,
                    totalCount: 0
                });
            }

            try{
                const modelRates = currencyRates.map(r => new CurrencyRate(r));

                currencyRates = await Promise.all(
                    modelRates.map(rate => rate.getPercentageChange())
                );

            } catch (error) {
                console.log("Failed to get percentage change: ", error);
            }

            return res.status(200).json({
                message: "Exchange rate retrieved successfully.",
                uploader: uploader,
                source: source,
                totalCount: currencyRates?.length,
                data: currencyRates
            });
        }

    } catch (error) {
        console.error("Error fetching currency rate:", error.message);

        return res.status(500).json({
            message: "An unexpected error occurred while fetching the latest currency rate.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


/**
 * @swagger
 * /currency/{currencyCode}/{date}:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve exchange rate(s) for a specific currency on a given date
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The currency code to fetch (use "ALL" to get all currencies)
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The date in 'YYYY-MM-DD' format
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: Number of records to skip for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Maximum number of records to return
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         required: false
 *         description: The source of the currency rates (default applied if omitted)
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         required: false
 *         description: Username of the uploader (default applied if omitted)
 *     responses:
 *       200:
 *         description: Exchange rate(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploader:
 *                   type: string
 *                 source:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 skip:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CurrencyRate'
 *       400:
 *         description: Invalid input (pagination or date format)
 *       404:
 *         description: No exchange rate record found for the given currency/date
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/:currencyCode/:date",expressCache({ timeOut: cacheTime, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}) ,async (req, res) => {
    try {
        const { currencyCode, date } = req.params;
        let {skip, limit} = req.query;

        let {source, uploader} = req.query;

        const normalizedCode = currencyCode.trim().toUpperCase();


        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 10;

        if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
            return res.status(400).json({
                message: "'skip' must be 0 or greater and 'limit' must be at least 1."
            });
        }

        // Validate date format (YYYY-MM-DD)
        if (!moment(date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
                message: "The date must be in 'YYYY-MM-DD' format. Example: 2025-08-25."
            });
        }

        const startOfDay = moment.tz(date, "YYYY-MM-DD", "Asia/Yangon").startOf("day").toDate();
        const endOfDay = moment.tz(date, "YYYY-MM-DD", "Asia/Yangon").endOf("day").toDate();

        // Query DB
        let count;
        if (normalizedCode === "ALL") {
            count = await CurrencyRate.countDocuments({
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            });
        }

        if(normalizedCode !== "ALL") {
            count = await CurrencyRate.countDocuments({
                currencyCode: normalizedCode,
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            });
        }


        if (!count || count < 1) {
            return res.status(404).json({
                message: `No exchange rate record found for '${currencyCode}' on ${date} from the default source.`,
                uploader: uploader,
                source: source,
                totalCount: count,
                skip: skip,
                limit: limit
            });
        }

        let currencyRates;

        if(normalizedCode === "ALL") {
            currencyRates = await CurrencyRate.find({
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).select('-__v');
        }

        if(normalizedCode !== "ALL") {
            currencyRates = await CurrencyRate.find({
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startOfDay, $lte: endOfDay },
                currencyCode: normalizedCode
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).select('-__v');
        }

        if (!currencyRates ) {
            return res.status(404).json({
                message: `No exchange rate record found for '${currencyCode}' on ${date} from the default source.`,
                uploader: uploader,
                source: source,
                totalCount: count,
                skip: skip,
                limit: limit
            });
        }


        return res.status(200).json({
            message: `Exchange rate for '${currencyCode}' on ${date} retrieved successfully.`,
            uploader: uploader,
            source: source,
            totalCount: count,
            skip: skip,
            limit: limit,
            data: currencyRates
        });

    } catch (error) {
        console.error("Error fetching currency rate:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching the exchange rate. Please try again later.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});

/**
 * @swagger
 * /currency/{currencyCode}/{fromDate}/{toDate}:
 *   get:
 *     tags:
 *       - Exchange Rates
 *     summary: Retrieve exchange rates for a currency between two dates
 *     parameters:
 *       - in: path
 *         name: currencyCode
 *         schema:
 *           type: string
 *         required: true
 *         description: The currency code to fetch (use "ALL" to get all currencies)
 *       - in: path
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date in 'YYYY-MM-DD' format
 *       - in: path
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date in 'YYYY-MM-DD' format
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         required: false
 *         description: Number of records to skip for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Maximum number of records to return
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         required: false
 *         description: Source of the currency rates (defaults if omitted)
 *       - in: query
 *         name: uploader
 *         schema:
 *           type: string
 *         required: false
 *         description: Username of the uploader (defaults if omitted)
 *     responses:
 *       200:
 *         description: Exchange rate(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploader:
 *                   type: string
 *                 source:
 *                   type: string
 *                 totalCount:
 *                   type: integer
 *                 skip:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CurrencyRate'
 *       400:
 *         description: Invalid input (pagination or date format)
 *       404:
 *         description: No exchange rate records found for the given criteria
 *       500:
 *         description: Internal server error
 */
currencyRouter.get("/:currencyCode/:fromDate/:toDate", expressCache({ timeOut: cacheTime, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
    try {
        const { currencyCode, fromDate, toDate } = req.params;
        let {source, uploader, skip, limit} = req.query;


        const normalizedCode = currencyCode.trim().toUpperCase();

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        skip = parseInt(skip) || 0;
        limit = parseInt(limit) || 10;

        if (isNaN(skip) || isNaN(limit) || skip < 0 || limit < 1) {
            return res.status(400).json({
                message: "'skip' must be 0 or greater and 'limit' must be at least 1."
            });
        }

        // Validate both dates
        if (!moment(fromDate, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
                message: "Invalid date format for 'fromDate'. Please use 'YYYY-MM-DD'."
            });
        }

        if (!moment(toDate, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
                message: "Invalid date format for 'toDate'. Please use 'YYYY-MM-DD'."
            });
        }

        // Convert to Date objects with startOf/endOf for inclusive range in Yangon timezone
        const startDate = moment.tz(fromDate, "YYYY-MM-DD", "Asia/Yangon").startOf("day").toDate();
        const endDate = moment.tz(toDate, "YYYY-MM-DD", "Asia/Yangon").endOf("day").toDate();



        // Query database
        let count;

        if(normalizedCode === "ALL") {
            count = await CurrencyRate.countDocuments({
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startDate, $lte: endDate }
            });
        }

        if(normalizedCode !== "ALL") {
            count = await CurrencyRate.countDocuments({
                currencyCode: normalizedCode,
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' },
                uploadedDate: { $gte: startDate, $lte: endDate }
            });
        }


        if (!count || count < 1) {
            return res.status(404).json({
                message: `No exchange rate found for currency '${normalizedCode}' between ${fromDate} and ${toDate}.`,
                uploader: uploader,
                source: source,
                totalCount: count,
                skip: skip,
                limit: limit
            });
        }

        let currencyRates;

        if(normalizedCode === "ALL") {
            currencyRates = await CurrencyRate.find({
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startDate, $lte: endDate }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).select('-__v');
        }

        if(normalizedCode !== "ALL") {
            currencyRates = await CurrencyRate.find({
                currencyCode: normalizedCode,
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startDate, $lte: endDate }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).select('-__v');
        }


        if (!currencyRates) {
            return res.status(404).json({
                message: `No exchange rate found for currency '${normalizedCode}' between ${fromDate} and ${toDate}.`,
                uploader: uploader,
                source: source,
                totalCount: count,
                skip: skip,
                limit: limit
            });
        }

        return res.status(200).json({
            message: "Exchange rate retrieved successfully.",
            uploader: uploader,
            source: source,
            totalCount: count,
            skip: skip,
            limit: limit,
            data: currencyRates
        });

    } catch (error) {
        console.error("Error fetching currency rate:", error.message);

        return res.status(500).json({
            message: "Unexpected error occurred while fetching currency rate.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});






module.exports = currencyRouter;
