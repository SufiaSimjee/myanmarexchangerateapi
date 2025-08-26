# Myanmar Foreign Currency Exchange Rate API (Version: 0 – Under Development)

## Description

This API provides information about foreign currency exchange rates in Myanmar. The data is collected personally by the developer from various publicly available online resources, including Facebook pages/groups/posts, the Myanmar Market Price app, and other applications/websites reporting currency rates.

It is designed to help people conveniently check exchange rates from a single place, rather than browsing multiple sources individually.

This API is intended to offer a general overview of currency rates in Myanmar and does not intend to replace official, unofficial, or other sources.

Users should treat the data as indicative rather than authoritative, and the developer cannot be held responsible for any inaccuracies, misinterpretations, or outcomes resulting from its use.

Note: All requests and responses use JSON format for simplicity and compatibility across different platforms and programming environments.

Api Url: https://myanmarexchangerateapi.onrender.com/

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

1.  Facebook Pages/Group reporting currency rates
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

-   **PORT** (The port your API server will run on)
-   **MONGODB_URL** (Your MongoDB connection string)
-   **HOST** (The host for the api. keep 0.0.0.0 for external accessibility)
-   **JWT_SECRET** (Secret key for signing JSON Web Tokens)
-   **NODE_ENV** (development or production)
-   **DEFAULT_SOURCE** (Default source label for uploaded exchange rates (e.g., Private Bank).)
-   **DEFAULT_UPLOADER** (Default username for the data uploader)
-   **DEFAULT_ADMIN_USERNAME** (Admin panel default username for first login setup)
-   **DEFAULT_ADMIN_PASSWORD** (Admin panel default password for first login setup)
-   **ON_RENDER** (Boolean flag (true / false) to check if app is running on Render hosting)
-   **LIVE_NOTIFICATION** (Enables/disables live socket notifications for real-time updates)

### 3. Install Dependencies and Start the Server
-   **npm install** (Install Dependency)
-   **pm2-runtime index.js** (Start Server).




