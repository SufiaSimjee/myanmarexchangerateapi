# Myanmar Foreign Currency Exchange Rate API (Version: 1.0.0)

## a. Description (Api Url: https://myanmarexchangerateapi.onrender.com)

This API provides information about foreign currency exchange rates in Myanmar. The data is collected personally by the developer from various publicly available online resources, including Facebook pages/groups/posts and other applications/websites reporting currency rates.

It is designed to help people conveniently check exchange rates from a single place, rather than browsing multiple sources individually.

Users can also create accounts and contribute by uploading their own exchange rates, making the platform more collaborative and transparent for the general public.

This API is intended to offer a general overview of currency rates in Myanmar and does not intend to replace official, unofficial, or other sources.

Users should treat the data as indicative rather than authoritative, and the developer cannot be held responsible for any inaccuracies, misinterpretations, or outcomes resulting from its use.

Additionally, the developer is building a front-end hybrid app using React Native (currently a work in progress) for both Android and Web. You can view the latest exchange rates at this link: **https://poutzay.expo.app/**


### Swagger Documentation:
- You can test and explore the API at: https://myanmarexchangerateapi.onrender.com/swagger

#### Example API Endpoints (Note: All requests and responses use JSON format for simplicity and compatibility across different platforms)

- **Get the latest USD rate:**  
  `https://myanmarexchangerateapi.onrender.com/currency/USD/latest`  
  This endpoint returns the most recent exchange rate for the US Dollar (USD) in Myanmar.

- **Get the latest rates for all currencies:**  
  `https://myanmarexchangerateapi.onrender.com/currency/all/latest`  
  This endpoint returns the latest exchange rates for all supported foreign currencies in Myanmar.


- **Get all currency rates for a specific date with filters and pagination:**  
  `https://myanmarexchangerateapi.onrender.com/currency/all/2025-08-28?uploader=admin123&source=Myanmar%20Market%20Price&skip=0&limit=10`  
  This endpoint returns exchange rate data for **all supported currencies** on the date **2025-08-27**, filtered by:
    - **uploader:** `admin123`
    - **source:** `Myanmar Market Price`
    - **skip:** `0` (number of records to skip, useful for pagination)
    - **limit:** `10` (maximum number of records to return)

  It allows you to retrieve filtered historical data for multiple currencies with pagination support.

- **Get the highest exchange rate for a specific currency on a specific date:**  
  `https://myanmarexchangerateapi.onrender.com/currency/USD/2025-08-28/highest?uploader=admin123&source=Myanmar%20Market%20Price`  
  This endpoint returns the **highest exchange rate** (based on `sellRate`) for the currency **USD** on the date **2025-08-28**, filtered by:
  - **uploader:** `admin123`
  - **source:** `Myanmar Market Price`

  If no data is available for that currency and date, a `404 Not Found` response is returned.

- **Get the lowest exchange rate for a specific currency on a specific date:**  
  `https://myanmarexchangerateapi.onrender.com/currency/USD/2025-08-28/lowest?uploader=admin123&source=Myanmar%20Market%20Price`  
  This endpoint returns the **lowest exchange rate** (based on `sellRate`) for the currency **USD** on the date **2025-08-28**, filtered by:
  - **uploader:** `admin123`
  - **source:** `Myanmar Market Price`

  If no data is available for that currency and date, a `404 Not Found` response is returned.

- **Get live updates for a specific currency using Socket.IO:**  
  `https://myanmarexchangerateapi.onrender.com/`  
  Users can receive **real-time currency rate updates** via Socket.IO by listening to a specific event. The event naming convention is:

    ```
    uploadedBy_source_currencyCode
    ```

  **Example event name:**
    ```
    admin123_Myanmar Market Price_USD
    ```

  This will provide JSON-formatted notifications **every 60 minutes**.

  **Example notification payload:**
  ```json
  {
      "currencyCode": "USD",
      "unit": 1,
      "buyRate": 4300,
      "sellRate": 4350,
      "uploadedDate": "2025-08-28 09:00:00",
      "source": "Myanmar Market Price",
      "uploadedBy": "admin123"
  }


#### i. Github Repo: https://github.com/kmnaing123/myanmarexchangerateapi

## b. How To Use Api 
1. Authentication Tutorial: https://myanmarexchangerateapi.onrender.com/auth-docs
2. Currency Rate Api Tutorial: https://myanmarexchangerateapi.onrender.com/currency-docs
3. Live Notification Tutorial:  https://myanmarexchangerateapi.onrender.com/notification-docs

## c. Target Audience
- Sellers (both individuals and currency exchange counters) who want to share exchange rates.
- General public who simply want to view and compare exchange rates from different sources in one place.

## d. Vision
- The developer believes there should be a platform where sellers can upload their exchange rates transparently, while the general public can easily view and compare rates from multiple sources. This would create more accessibility, fairness, and convenience in how exchange rate information is shared in Myanmar.


## e. Disclaimer
1. The data may not be 100% accurate.
2. The developer does not take any responsibility for any discrepancies, losses, or damages resulting from the use of this API or the data it provides.
3. This API is provided for informational purposes only. Users are solely responsible for verifying any data before relying on it.

## f. Motivation
The main purpose of this API is to inform users about daily exchange rates from both unofficial and official sources. In Myanmar, multiple rates exist, such as:

1. Central Bank of Myanmar Rate
2. Bank Rate
3. Market Rate


## g. Data Sources
1.  Facebook Pages/Groups reporting currency rates
2.  Online Sources

## h. Recommended Usage
1. Use the API for quick reference of Myanmar currency rates.
2. Monitor API updates and check the notification feature once it’s re-enabled. Currently, use polling to stay updated.

## i. Technology Stack
1.  **Backend:** Node.js (Express.js)
2.  **Database:** MongoDB (MongoDB Atlas)
3.  **Protocols:** HTTPS and WebSocket (Socket IO)

## j. Project Dependencies

### i. Core Libraries
1. **express (^5.1.0)** – Web framework for building the API and handling HTTP requests.
2. **dotenv (^17.2.1)** – Loads environment variables from a `.env` file.
3. **mongoose (^8.18.0)** – MongoDB object modeling tool for Node.js.
4. **moment-timezone (^0.6.0)** – Utilities for parsing, formatting, and handling dates and timezones.

### ii. Security & Authentication
1. **bcrypt (^6.0.0)** – Hashing library for securely storing passwords.
2. **helmet (^8.1.0)** – Adds security-related HTTP headers to protect the API.
3. **passport (^0.7.0)** – Authentication middleware for Node.js.
4. **passport-jwt (^4.0.1)** – JWT authentication strategy for Passport.
5. **jsonwebtoken (^9.0.2)** – For creating and verifying JSON Web Tokens.

### iii. Performance & Utilities
1. **compression (^1.8.1)** – Gzip compression to reduce response size and improve performance.
2. **cache-express (^1.0.2)** – Caching middleware for Express responses.
3. **node-cache (^5.1.2)** – In-memory caching solution for Node.js.
4. **express-rate-limit (^8.0.1)** – Rate limiting to prevent brute-force attacks.

### iv. Logging & Monitoring
1. **morgan (^1.10.1)** – HTTP request logger middleware for Express.
2. **rotating-file-stream (^3.2.7)** – Manage log file.

### v. Real-Time & Scheduling
1. **socket.io (^4.8.1)** – Enables real-time bidirectional communication (To send live notification to clients).
2. **node-cron (^4.2.1)** – Task scheduler for running jobs at specific intervals (To check for new exchange rates uploaded to the database).

### vi. Process Management & Templating
1. **pm2 (^6.0.8)** – Process manager for Node.js to run applications in production (To restart the node process if crashes occur).
2. **pug (^3.0.3)** – Template engine for server-side rendering (To render tutorial written in html format).
3. **cors (^2.8.5)** – To enable Cross-Origin Resource Sharing for allowing requests from different origins.
4. **marked (^5.x)** – Converts Markdown (`.md`) files into HTML for rendering with Pug.

## k. Getting Started (Self Hosting)

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
-   **DEFAULT_ADMIN_USERNAME** (Username of a default admin account)
-   **DEFAULT_ADMIN_PASSWORD** (Password of a default admin account)
-   **ON_RENDER** (Boolean flag (true / false) to check if app is running on Render cloud service)
-   **LIVE_EXCHANGE_RATE** (Enables/disables websocket (Socket IO) notifications for real-time updates of exchange rate)
-   **NOTIFICATION_INTERVAL** (Interval rate (minute) for notification)


Note: The default admin account (configured via DEFAULT_ADMIN_USERNAME and DEFAULT_ADMIN_PASSWORD) has full privileges to perform any action in the system.

### 3. Install Dependencies and Start the Server
-   **npm install** (Install Dependency)
-   **pm2-runtime index.js** (Start Server).




