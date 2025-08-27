const express = require("express");
const {join} = require("node:path");
const TutorialRouter = express.Router();



TutorialRouter.get('/currency-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}/currency/`;

        res.render('currencyDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering currency docs:", error);
        res.status(500).send("An error occurred while rendering the currency documentation.");
    }
});

module.exports = TutorialRouter;