const express = require("express");
const TutorialRouter = express.Router();



TutorialRouter.get('/currency-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        let baseUrl = `${protocol}://${host}/currency`;

        if(process.env.ON_RENDER === "true"){
            baseUrl = 'https://myanmarexchangerateapi.onrender.com/currency'
        }

        res.render('CurrencyDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering currency docs:", error);
        res.status(500).send("An error occurred while rendering documentation.");
    }
});


TutorialRouter.get('/auth-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        let baseUrl = `${protocol}://${host}/user`;

        if(process.env.ON_RENDER === "true"){
            baseUrl = 'https://myanmarexchangerateapi.onrender.com/user'
        }

        res.render('AuthDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering AuthDocs docs:", error);
        res.status(500).send("An error occurred while rendering documentation.");
    }
});


TutorialRouter.get('/notification-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        let baseUrl = `${protocol}://${host}`;

        if(process.env.ON_RENDER === "true"){
            baseUrl = 'https://myanmarexchangerateapi.onrender.com'
        }

        res.render('NotificationDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering NotificationDocs docs:", error);
        res.status(500).send("An error occurred while rendering documentation.");
    }
});


module.exports = TutorialRouter;