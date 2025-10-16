const express = require("express");
const TutorialRouter = express.Router();

/**
 * @swagger
 * /currency-docs:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Render currency API documentation
 *     responses:
 *       200:
 *         description: Successfully rendered currency documentation
 */

TutorialRouter.get('/currency-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        let baseUrl = `${protocol}://${host}/currency`;

        if(process.env.ON_RENDER === "true"){
            baseUrl = 'https://758huyl2ob.execute-api.ap-southeast-2.amazonaws.com/currency'
        }
        res.render('CurrencyDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering currency docs:", error);
        res.status(500).send("An error occurred while rendering documentation.");
    }
});


/**
 * @swagger
 * /auth-docs:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Render authentication API documentation
 *     responses:
 *       200:
 *         description: Successfully rendered authentication documentation
 */
TutorialRouter.get('/auth-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        let baseUrl = `${protocol}://${host}/user`;

        if(process.env.ON_RENDER === "true"){
            baseUrl = 'https://758huyl2ob.execute-api.ap-southeast-2.amazonaws.com/user'
        }
        res.render('AuthDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering AuthDocs docs:", error);
        res.status(500).send("An error occurred while rendering documentation.");
    }
});

/**
 * @swagger
 * /notification-docs:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Render notification API documentation
 *     responses:
 *       200:
 *         description: Successfully rendered notification documentation
 */
TutorialRouter.get('/notification-docs', (req, res) => {
    try {
        const protocol = req.protocol;
        const host = req.get('host');
        let baseUrl = `${protocol}://${host}`;

        if(process.env.ON_RENDER === "true"){
            baseUrl = 'https://758huyl2ob.execute-api.ap-southeast-2.amazonaws.com'
        }

        res.render('NotificationDocs', { baseUrl });
    } catch (error) {
        console.error("Error rendering NotificationDocs docs:", error);
        res.status(500).send("An error occurred while rendering documentation.");
    }
});


module.exports = TutorialRouter;