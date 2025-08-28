const passport = require("passport");
const express = require("express");
const expressCache = require("cache-express")

const moment = require("moment-timezone");
const currencyRouter = express.Router();
const CurrencyRate = require("../Models/CurrencyRateSchema");
const yangonDate = require("../Helpers/YangonDate");



let currencyRateUpdateTracker = 0;
let defaultSource = process.env.DEFAULT_SOURCE;
let defaultUploader = process.env.DEFAULT_UPLOADER;

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
                message: "No uploaders found in the database.",
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
                    uploadedBy: "$_id"
                }
            },
            {
                $sort: { uploadedBy: 1 }
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
                    source: "$_id"
                }
            },
            {
                $sort: { source: 1 }
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
        console.log("formattedDate", formattedDate);

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


        req.io.emit(`${result.uploadedBy}_${result.source}_${result.currencyCode}`, JSON.stringify(result));

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


currencyRouter.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { id } = req.params;
        let {username} = req.user

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
        if (currencyRateUpdateTracker > 0) {
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


currencyRouter.get('/:id', expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}),async (req, res) => {
    try {
        const { id } = req.params;

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

currencyRouter.get("/:currencyCode/latest",expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
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
            const currencyRate = await CurrencyRate.findOne({
                currencyCode: normalizedCode,
                uploadedBy: { $regex: `^${uploader}$`, $options: 'i' },
                source: { $regex: `^${source}$`, $options: 'i' }
            }).sort({ uploadedDate: -1 }).select('-__v').lean();

            if (!currencyRate) {
                return res.status(404).json({
                    message: `No latest exchange rate found for currency '${normalizedCode}' from the default source.`,
                    uploader: uploader,
                    source: source,
                    totalCount: 0
                });
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

            // Apply Yangon timezone formatting
            currencyRates = currencyRates.map(rate => ({
                ...rate,
                uploadedDate: yangonDate(rate.uploadedDate),
                createdAt: yangonDate(rate.createdAt),
                updatedAt: yangonDate(rate.updatedAt)

            }));

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


currencyRouter.get("/:currencyCode/:date",expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}) ,async (req, res) => {
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

currencyRouter.get("/:currencyCode/:fromDate/:toDate", expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
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
