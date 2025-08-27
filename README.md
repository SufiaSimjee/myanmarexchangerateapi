# Myanmar Foreign Currency Exchange Rate API (Version: 0 – Under Development)

## a.Description

This API provides information about foreign currency exchange rates in Myanmar. The data is collected personally by the developer from various publicly available online resources, including Facebook pages/groups/posts, the Myanmar Market Price app, and other applications/websites reporting currency rates.

It is designed to help people conveniently check exchange rates from a single place, rather than browsing multiple sources individually.

This API is intended to offer a general overview of currency rates in Myanmar and does not intend to replace official, unofficial, or other sources.

Users should treat the data as indicative rather than authoritative, and the developer cannot be held responsible for any inaccuracies, misinterpretations, or outcomes resulting from its use.

#### Api Url: https://myanmarexchangerateapi.onrender.com

#### Note
1. All requests and responses use JSON format for simplicity and compatibility across different platforms and programming environments.
2. The notification feature is currently disabled due to a known bug and will be re-enabled once fixed.


## b.How To Use Api 
1. Authentication Tutorial: https://myanmarexchangerateapi.onrender.com/auth-docs
2. Currency Rate Api Tutorial: https://myanmarexchangerateapi.onrender.com/currency-docs
3. Live Notification Tutorial:  https://myanmarexchangerateapi.onrender.com/notification-docs


## c.Disclaimer

1. The data may not be 100% accurate.
2. The developer does not take any responsibility for any discrepancies, losses, or damages resulting from the use of this API or the data it provides.
3. This API is provided for informational purposes only. Users are solely responsible for verifying any data before relying on it.

## d.Motivation

The main purpose of this API is to inform users about daily exchange rates from both unofficial and official sources. In Myanmar, multiple rates exist, such as:

1. Central Bank of Myanmar Rate
2. Bank Rate
3. Market Rate


## e.Data Sources

1.  Facebook Pages/Groups reporting currency rates
2.  Myanmar Market Price App
3.  Other Online Sources

## f.Recommended Usage
1. Use the API for quick reference of Myanmar currency rates.
2. Monitor API updates and check the notification feature once it’s re-enabled.

## g.Technology Stack

1.  **Backend:** Node.js (Express.js)
2.  **Database:** MongoDB (MongoDB Atlas)
3.  **Protocols:** HTTPS and WebSocket (Socket IO)

## h.Project Dependencies

### i.Core Libraries
1. **express (^5.1.0)** – Web framework for building the API and handling HTTP requests.
2. **dotenv (^17.2.1)** – Loads environment variables from a `.env` file.
3. **mongoose (^8.18.0)** – MongoDB object modeling tool for Node.js.
4. **moment-timezone (^0.6.0)** – Utilities for parsing, formatting, and handling dates and timezones.

### ii.Security & Authentication
1. **bcrypt (^6.0.0)** – Hashing library for securely storing passwords.
2. **helmet (^8.1.0)** – Adds security-related HTTP headers to protect the API.
3. **passport (^0.7.0)** – Authentication middleware for Node.js.
4. **passport-jwt (^4.0.1)** – JWT authentication strategy for Passport.
5. **jsonwebtoken (^9.0.2)** – For creating and verifying JSON Web Tokens.

### iii.Performance & Utilities
1. **compression (^1.8.1)** – Gzip compression to reduce response size and improve performance.
2. **cache-express (^1.0.2)** – Caching middleware for Express responses.
3. **node-cache (^5.1.2)** – In-memory caching solution for Node.js.
4. **express-rate-limit (^8.0.1)** – Rate limiting to prevent brute-force attacks.

### iv.Logging & Monitoring
1. **morgan (^1.10.1)** – HTTP request logger middleware for Express.
2. **rotating-file-stream (^3.2.7)** – Manage log file.

### v.Real-Time & Scheduling
1. **socket.io (^4.8.1)** – Enables real-time bidirectional communication (To send live notification to clients).
2. **node-cron (^4.2.1)** – Task scheduler for running jobs at specific intervals (To check for new exchange rates uploaded to the database).

### vi.Process Management & Templating
1. **pm2 (^6.0.8)** – Process manager for Node.js to run applications in production (To restart the node process if crashes occur).
2. **pug (^3.0.3)** – Template engine for server-side rendering (To render tutorial written in html format).
3. **cors (^2.8.5)** – To enable Cross-Origin Resource Sharing for allowing requests from different origins.
4. **marked (^5.x)** – Converts Markdown (`.md`) files into HTML for rendering with Pug.

## i.Getting Started (Self Hosting)

### 1.Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **MongoDB Atlas Account** (First, create a database on MongoDB Atlas and obtain the connection string).

### 2.Set Environment Variables

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
-   **LIVE_EXCHANGE_RATE** (Enables/disables websocket (Socket IO) notifications for real-time updates of exchange rate)
-   **NOTIFICATION_INTERVAL** (Interval rate (minute) for notification)


Note: The default admin account (configured via DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD) has full privileges to perform any action in the system.

### 3.Install Dependencies and Start the Server
-   **npm install** (Install Dependency)
-   **pm2-runtime index.js** (Start Server).




