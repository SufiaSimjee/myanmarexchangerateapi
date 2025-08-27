# Myanmar Foreign Currency Exchange Rate API (Version: 0 – Under Development)

## Description

This API provides information about foreign currency exchange rates in Myanmar. The data is collected personally by the developer from various publicly available online resources, including Facebook pages/groups/posts, the Myanmar Market Price app, and other applications/websites reporting currency rates.

It is designed to help people conveniently check exchange rates from a single place, rather than browsing multiple sources individually.

This API is intended to offer a general overview of currency rates in Myanmar and does not intend to replace official, unofficial, or other sources.

Users should treat the data as indicative rather than authoritative, and the developer cannot be held responsible for any inaccuracies, misinterpretations, or outcomes resulting from its use.

Note: All requests and responses use JSON format for simplicity and compatibility across different platforms and programming environments.

Api Url: https://myanmarexchangerateapi.onrender.com


## How To Use Api
1. Authentication Tutorial: https://myanmarexchangerateapi.onrender.com/auth-docs
2. Currency Rate Api Tutorial: https://myanmarexchangerateapi.onrender.com/currency-docs
3. Live Notification Tutorial:  https://myanmarexchangerateapi.onrender.com/notification-docs


## Disclaimer

1. The data may not be 100% accurate.
2. The developer does not take any responsibility for any discrepancies, losses, or damages resulting from the use of this API or the data it provides.
3. This API is provided for informational purposes only. Users are solely responsible for verifying any data before relying on it.

## Motivation

The main purpose of this API is to inform users about daily exchange rates from both unofficial and official sources. In Myanmar, multiple rates exist, such as:

1. Central Bank of Myanmar Rate
2. Bank Rate
3. Market Rate


## Data Sources

1.  Facebook Pages/Groups reporting currency rates
2.  Myanmar Market Price App
3.  Other Online Sources

## Technology Stack

1.  **Backend:** Node.js (Express.js)
2.  **Database:** MongoDB (MongoDB Atlas)
3.  **Protocols:** HTTPS and WebSocket (Socket Io)

## Getting Started (Self Hosting)

### 1. Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **MongoDB Atlas Account** (First, create a database on MongoDB Atlas and obtain the connection string).

### 2. Set Environment Variables

Create a `.env` file in the project root with the following variables:

-   **PORT** (The port your Api will run on)
-   **MONGODB_URL** (Your MongoDB connection string)
-   **HOST** (The host for the api. keep 0.0.0.0 for external accessibility)
-   **JWT_SECRET** (Secret key for signing JWT Tokens)
-   **NODE_ENV** (development or production)
-   **DEFAULT_SOURCE** (Label for the default source of exchange rates (e.g., Private Bank).)
-   **DEFAULT_UPLOADER** (Username of the default data uploader)
-   **DEFAULT_ADMIN_USERNAME** (Username of default admin account)
-   **DEFAULT_ADMIN_PASSWORD** (Password of default admin account)
-   **ON_RENDER** (Boolean flag (true / false) to check if app is running on Render hosting)
-   **LIVE_EXCHANGE_RATE** (Enables/disables websocket (Socket Io) notifications for real-time updates of exchange rate)
-   **NOTIFICATION_INTERVAL** (Interval rate (minute) for notification)


Note: The default admin account (configured via DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD) has full privileges to perform any action in the system.

### 3. Install Dependencies and Start the Server
-   **npm install** (Install Dependency)
-   **pm2-runtime index.js** (Start Server).




