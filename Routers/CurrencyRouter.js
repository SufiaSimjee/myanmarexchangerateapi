const passport = require("passport");
const express = require("express");
const expressCache = require("cache-express")

const moment = require("moment-timezone");
const currencyRouter = express.Router();
const CurrencyRate = require("../Models/CurrencyRateSchema");


let currencyRateUpdateTracker = 0;
let defaultSource = process.env.DEFAULT_SOURCE|| "Private Bank"
let defaultUploader = process.env.DEFAULT_UPLOADER || "testuser";

currencyRouter.get("/uploaderList", async (req, res) => {
    try {

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
            }
        ]);


        if (!uniqueUploader) {
            return res.status(404).json({
                message: "No uploader found in the database."
            });
        }

        return res.status(200).json({
            message: "Uploader List retrieved successfully.",
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
        let {uploader} = req.query;

        if (!uploader) {
            uploader = defaultUploader;
        }


        const uniqueSources = await CurrencyRate.aggregate([
            {
                $match: {
                    uploadedBy: uploader
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

        if (!uniqueSources) {
            return res.status(404).json({
                message: "No sources found in the database."
            });
        }

        return res.status(200).json({
            message: "Sources retrieved successfully.",
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
        let {source, uploader} = req.query;

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        const uniqueCurrencies = await CurrencyRate.aggregate([
            {
                $match: {
                    source: source,
                    uploadedBy: uploader
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

        if (!uniqueCurrencies) {
            return res.status(404).json({
                message: "No currencies found in the database."
            });
        }

        return res.status(200).json({
            message: "Currencies retrieved successfully.",
            data: uniqueCurrencies,
        });

    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred while fetching the currency list.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});


currencyRouter.post("/add", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try{
        let { currencyName, currencyCode, currencyIcon, unit, buyRate, sellRate, uploadedDate, source } = req.body;
        let {username} = req.user


        if (!currencyName || !currencyCode || !currencyIcon || !unit || !buyRate || !sellRate || !uploadedDate || !source) {
            return res.status(400).json({
                message: "All fields are required: currencyName, currencyCode, currencyIcon, unit, buyRate, sellRate, uploadedDate, source.",
            });
        }

        // Validate uploadedDate format with time included
        if (!moment(uploadedDate, "YYYY-MM-DD HH:mm:ss", true).isValid() && !moment(uploadedDate, moment.ISO_8601, true).isValid()) {
            return res.status(400).json({
                message: "Invalid uploadedDate format. Please use 'YYYY-MM-DD HH:mm:ss' or ISO format.",
            });
        }

        // Convert uploadedDate to a moment object (assuming it's in "YYYY-MM-DD HH:mm:ss" or ISO format)
        const unformattedDate = moment.tz(uploadedDate, ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601], "Asia/Yangon");

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
                { currencyName: currencyName },
                { currencyCode: currencyCode.toUpperCase()},
                { currencyIcon: currencyIcon },
                { unit: unit },
                { buyRate: buyRate },
                { sellRate: sellRate },
                { source: source},
                { uploadedDate: formattedDate },
                { uploadedBy: username}
            ]
        });

        if (existingRate) {
            return res.status(409).json({ // 409 Conflict
                message: `An exchange rate for ${currencyName} on ${uploadedDate} by ${username} already exists.`,
            });
        }

        const newRate = new CurrencyRate({
            currencyName: currencyName,
            currencyCode: currencyCode.toUpperCase(),
            currencyIcon: currencyIcon,
            unit: unit,
            buyRate: buyRate,
            sellRate: sellRate,
            source: source,
            uploadedDate: uploadedDate,
            uploadedBy: username,
        });

        const result = await newRate.save();

        currencyRateUpdateTracker++;


        req.io.emit(result.currencyCode, JSON.stringify(result));

        return res.status(201).json({ // 201 Created
            message: `Exchange rate for ${currencyName} added successfully.`,
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
                message: `No currency exchange rate found with ID '${id}'.`
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
        const exchangeRate = await CurrencyRate.findById(id);

        if (!exchangeRate) {
            return res.status(404).json({
                message: `No currency exchange rate found with ID '${id}'.`
            });
        }

        return res.status(200).json({ // 200 OK
            message: `Currency exchange rate with ID '${id}' has been retrieve successfully.`,
            data: exchangeRate,
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

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        if(currencyCode !== "all" || currencyCode !== "All" || currencyCode !== "ALL") {
            const currencyRate = await CurrencyRate.findOne({
                currencyCode: currencyCode.toUpperCase(),
                uploadedBy: uploader,
                source: source
            }).sort({ uploadedDate: -1 }).lean();

            if (!currencyRate) {
                return res.status(404).json({
                    message: `No latest exchange rate found for currency '${currencyCode}' from the default source.`
                });
            }

            return res.status(200).json({
                message: "Latest exchange rate retrieved successfully.",
                data: currencyRate
            });
        } else {
            const currencyRates = await CurrencyRate.aggregate([
                // Only include records uploaded by default source
                { $match: { uploadedBy: uploader, source: source } },

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

            if (!currencyRates) {
                return res.status(404).json({
                    message: `No latest exchange rate found.`
                });
            }

            return res.status(200).json({
                message: "Exchange rate retrieved successfully.",
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
        const {skip, limit} = req.query;

        let {source, uploader} = req.query;

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        if (!skip || !limit) {
            return res.status(400).json({
                message: "Both 'skip' and 'limit' query parameters are required for pagination."
            });
        }

        if (skip < 0 || limit < 1) {
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
        if (currencyCode  === "all") {
            count = await CurrencyRate.countDocuments({
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            });
        } else {
            count = await CurrencyRate.countDocuments({
                currencyCode: currencyCode.toUpperCase(),
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            });
        }


        if (!count || count <= 1) {
            return res.status(404).json({
                message: `No exchange rate record found for '${currencyCode}' on ${date} from the default source.`,
                count: count,
                skip: skip,
                limit: limit
            });
        }

        let currencyRates;

        if(currencyCode === "all" || currencyCode === "All" || currencyCode === "ALL") {
            currencyRates = await CurrencyRate.find({
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).lean();

        } else {
            currencyRates = await CurrencyRate.find({
                currencyCode: currencyCode.toUpperCase(),
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).lean();
        }


        if (!currencyRates ) {
            return res.status(404).json({
                message: `No exchange rate record found for '${currencyCode}' on ${date} from the default source.`,
                count: count,
                skip: skip,
                limit: limit
            });
        }

        return res.status(200).json({
            message: `Exchange rate for '${currencyCode}' on ${date} retrieved successfully.`,
            count: count,
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


currencyRouter.get("/count/:currencyCode/:date", expressCache({timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => {console.log(`Cache removed for key: ${key}`);}}),
    async (req, res) => {
        try {
            const { currencyCode, date } = req.params;
            let {source, uploader} = req.query;

            if (!source) {
                source = defaultSource;
            }

            if (!uploader) {
                uploader = defaultUploader;
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

            if(currencyCode === "all" || currencyCode === "All" || currencyCode === "ALL") {
                count = await CurrencyRate.countDocuments({
                    uploadedBy: uploader,
                    source: source,
                    uploadedDate: { $gte: startOfDay, $lte: endOfDay }
                });
            } else{
                count = await CurrencyRate.countDocuments({
                    currencyCode: currencyCode.toUpperCase(),
                    uploadedBy: uploader,
                    source: source,
                    uploadedDate: { $gte: startOfDay, $lte: endOfDay }
                });
            }


            if (!count) {
                return res.status(404).json({
                    message: `No exchange rate records found for currency '${currencyCode}' on ${date}.`
                });
            }

            return res.status(200).json({
                message: `Exchange rate record count fetched successfully for '${currencyCode}' on ${date}.`,
                data: count
            });

        } catch (error) {
            console.error("Error fetching currency rate count:", error);

            return res.status(500).json({
                message: "Something went wrong while fetching the exchange rate count. Please try again later.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
);


currencyRouter.get("/:currencyCode/:fromDate/:toDate", expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
    try {
        const { currencyCode, fromDate, toDate } = req.params;
        const {skip, limit} = req.query;

        let {source, uploader} = req.query;

        if (!source) {
            source = defaultSource;
        }

        if (!uploader) {
            uploader = defaultUploader;
        }

        if (!skip || !limit) {
            return res.status(400).json({
                message: "Both 'skip' and 'limit' query parameters are required for pagination."
            });
        }

        if (skip < 0 || limit < 1) {
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

        if(currencyCode === "all" || currencyCode === "All" || currencyCode === "ALL") {
            count = await CurrencyRate.countDocuments({
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startDate, $lte: endDate }
            });
        } else{
            count = await CurrencyRate.countDocuments({
                currencyCode: currencyCode.toUpperCase(),
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startDate, $lte: endDate }
            });
        }


        if (!count || count < 1) {
            return res.status(404).json({
                message: `No exchange rate found for currency '${currencyCode}' between ${fromDate} and ${toDate}.`,
                count: count,
                skip: skip,
                limit: limit
            });
        }

        let currencyRates;

        if(currencyCode === "all" || currencyCode === "All" || currencyCode === "ALL") {
            currencyRates = await CurrencyRate.find({
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startDate, $lte: endDate }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).lean();
        } else{
            currencyRates = await CurrencyRate.find({
                currencyCode: currencyCode.toUpperCase(),
                uploadedBy: uploader,
                source: source,
                uploadedDate: { $gte: startDate, $lte: endDate }
            }).sort({ uploadedDate: -1 }).skip(skip).limit(limit).lean();
        }


        if (!currencyRates) {
            return res.status(404).json({
                message: `No exchange rate found for currency '${currencyCode}' between ${fromDate} and ${toDate}.`,
                count: count,
                skip: skip,
                limit: limit
            });
        }

        return res.status(200).json({
            message: "Exchange rate retrieved successfully.",
            count: count,
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

currencyRouter.get("/count/:currencyCode/:fromDate/:toDate", expressCache({timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, _) => {console.log(`Cache removed for key: ${key}`);}}),
    async (req, res) => {
        try {
            const { currencyCode, fromDate, toDate } = req.params;
            let {source, uploader} = req.query;

            if (!source) {
                source = defaultSource;
            }

            if (!uploader) {
                uploader = defaultUploader;
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
            if(currencyCode === "all" || currencyCode === "All" || currencyCode === "ALL") {
                count = await CurrencyRate.countDocuments({
                    uploadedBy: uploader,
                    source: source,
                    uploadedDate: { $gte: startDate, $lte: endDate }
                });

            } else{
                count = await CurrencyRate.countDocuments({
                    currencyCode: currencyCode.toUpperCase(),
                    uploadedBy: uploader,
                    source: source,
                    uploadedDate: { $gte: startDate, $lte: endDate }
                });
            }

            if (!count) {
                return res.status(404).json({
                    message: `No currency rate records found for ${currencyCode} between ${fromDate} and ${toDate}.`
                });
            }

            return res.status(200).json({
                message: `Found ${count} record(s) for ${currencyCode} between ${fromDate} and ${toDate}.`,
                data: count
            });

        } catch (error) {
            console.error("Error fetching currency rate count:", error.message);

            return res.status(500).json({
                message: "Unexpected error occurred while fetching currency rate count.",
                details: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
);



module.exports = currencyRouter;
