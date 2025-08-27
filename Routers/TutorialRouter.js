const express = require("express");
const TutorialRouter = express.Router();



TutorialRouter.get('/currency-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}/currency/`;

        res.render('CurrencyDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering currency docs:", error);
        res.status(500).send("An error occurred while rendering the currency documentation.");
    }
});


TutorialRouter.get('/auth-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        const baseUrl = `${protocol}://${host}/user/`;

        res.render('AuthDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering currency docs:", error);
        res.status(500).send("An error occurred while rendering the currency documentation.");
    }
});

module.exports = TutorialRouter;