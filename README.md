# Myanmar Foreign Currency Exchange Rate API (Version: 0 – Under Development)

## Description

This API provides information about foreign currency exchange rates in Myanmar. The data is collected personally by the developer from various publicly available online resources, including Facebook pages, the Myanmar Market Price app, and other websites reporting currency rates.

This API is intended to offer a general overview of currency rates in Myanmar and does not intend to replace official sources or guarantee complete accuracy. Users should treat the data as indicative rather than authoritative.

Note: All requests and responses use JSON format for simplicity and compatibility across different platforms and programming environments.

## Disclaimer

1. The data may not be 100% accurate.
2. The developer does not take any responsibility for any discrepancies, losses, or damages resulting from the use of this API or the data it provides.
3. This API is provided for informational purposes only. Users are solely responsible for verifying any data before relying on it.

## Motivation

The main purpose of this API is to inform users about daily exchange rates from both unofficial and official sources. In Myanmar, multiple rates exist, such as:

1.  Central Bank Rate
2.  Bank Rate
3. Market Rate

This API aims to provide a general overview of current foreign currency rates in Myanmar.

## Data Sources

1.  Facebook Pages/Group reporting currency rates
2.  Myanmar Market Price App
3.  Other Online Sources

## Technology Stack

1.  **Backend:** Node.js (Express.js)
2.  **Database:** MongoDB (MongoDB Atlas)
3.  **Protocols:** HTTPS and WebSocket

## Getting Started

### 1. Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **MongoDB Atlas Account** (First, create a database on MongoDB Atlas and obtain the connection string).

### 2. Set Environment Variables

Create a `.env` file in the project root with the following variables:

-   **PORT** (your_chosen_port_number)
-   **MONGODBURL** (your database connection string).
-   **HOST** (0.0.0.0).
-   **JWT_SECRET** (your_jwt_secret).
-   **NODE_ENV** (production).

### 3. Install Dependencies and Start the Server
-   **npm install** (Install Dependency)
-   **npm start** (Start Server).




