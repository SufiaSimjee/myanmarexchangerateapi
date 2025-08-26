const passport = require("passport");
const express = require("express");
const expressCache = require("cache-express")

const moment = require("moment");
const currencyRouter = express.Router();
const CurrencyRate = require("../Models/CurrencyRateSchema");


let currencyRateUpdateTracker = 0;
let defaultSource = process.env.DEFAULT_SOURCE|| "testuser"

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

        // Convert to Date object including time
        const unformattedDate = moment(uploadedDate, ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601]);

        const currentDate = moment();

        if(unformattedDate.isAfter(currentDate)){
            return res.status(400).json({
                message: "Uploaded date cannot be in the future!",
            });
        }

        const formattedDate = unformattedDate.toDate();

        const existingRate = await CurrencyRate.findOne({
            $and: [
                { currencyName: currencyName },
                { currencyCode: currencyCode },
                { currencyIcon: currencyIcon },
                { unit: unit },
                { buyRate: buyRate },
                { sellRate: sellRate },
                {source: source},
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
            currencyCode: currencyCode,
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

        // Find the currency rate by ID
        const exchangeRate = await CurrencyRate.findById(id);

        if (!exchangeRate) {
            return res.status(404).json({
                message: `No currency exchange rate found with ID '${id}'.`
            });
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


currencyRouter.get('/:id', expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, value) => { console.log(`Cache removed for key: ${key}`); }}),async (req, res) => {
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

currencyRouter.get("/:currencyCode/latest",expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, value) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
    const { currencyCode } = req.params;
    try {
        console.log(currencyCode);
        if(currencyCode !== "all") {
            const currencyRate = await CurrencyRate.findOne({
                currencyCode: currencyCode,
                uploadedBy: defaultSource
            }).sort({ uploadedDate: -1 });

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

            console.log(currencyRates);

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


currencyRouter.get("/:currencyCode/:date",expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, value) => { console.log(`Cache removed for key: ${key}`); }}) ,async (req, res) => {
    try {
        const { currencyCode, date } = req.params;

        // Validate date format (YYYY-MM-DD)
        if (!moment(date, "YYYY-MM-DD", true).isValid()) {
            return res.status(400).json({
                error: "Invalid Date Format",
                message: "The date must be in 'YYYY-MM-DD' format. Example: 2025-08-25."
            });
        }

        const startOfDay = moment(date, "YYYY-MM-DD").startOf("day").toDate();
        const endOfDay = moment(date, "YYYY-MM-DD").endOf("day").toDate();

        // Query DB
        const currencyRate = await CurrencyRate.findOne({
            currencyCode: currencyCode,
            uploadedBy: defaultSource,
            uploadedDate: { $gte: startOfDay, $lte: endOfDay }
        });

        if (!currencyRate) {
            return res.status(404).json({
                message: `No exchange rate record found for '${currencyCode}' on ${date} from the default source.`
            });
        }

        return res.status(200).json({
            message: `Exchange rate for '${currencyCode}' on ${date} retrieved successfully.`,
            data: currencyRate
        });

    } catch (error) {
        console.error("Error fetching currency rate:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching the exchange rate. Please try again later.",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});




currencyRouter.get("/:currencyCode/:fromDate/:toDate", expressCache({ timeOut: 60000, dependsOn: () => [currencyRateUpdateTracker], onTimeout: (key, value) => { console.log(`Cache removed for key: ${key}`); }}), async (req, res) => {
    try {
        const { currencyCode, fromDate, toDate } = req.params;

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

        // Convert to Date objects with startOf/endOf for inclusive range
        const startDate = moment(fromDate, "YYYY-MM-DD").startOf("day").toDate();
        const endDate = moment(toDate, "YYYY-MM-DD").endOf("day").toDate();

        // Query database
        const currencyRate = await CurrencyRate.findOne({
            currencyCode: currencyCode,
            uploadedBy: defaultSource,
            uploadedDate: { $gte: startDate, $lte: endDate }
        });

        if (!currencyRate) {
            return res.status(404).json({
                message: `No exchange rate found for currency '${currencyCode}' between ${fromDate} and ${toDate}.`
            });
        }

        return res.status(200).json({
            message: "Exchange rate retrieved successfully.",
            data: currencyRate
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
