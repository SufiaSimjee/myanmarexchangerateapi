const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Myanmar Foreign Currency Exchange Rate API (Version: 0 – Under Development)',
            version: '0',
            description: "This API provides information about foreign currency exchange rates in Myanmar, collected from publicly available online resources such as Facebook pages, groups, posts, the Myanmar Market Price app, and other websites. It helps users conveniently check exchange rates from a single source. The data is indicative and should not replace official or unofficial sources. All requests and responses use JSON format.",
        },
        servers: [
            {
                url:  process.env.ON_RENDER === "true" ? 'https://myanmarexchangerateapi.onrender.com': `https://localhost:${process.env.PORT}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                SourceItem: {
                    type: "object",
                    required: ["sourceName"],
                    properties: {
                        sourceName: {
                            type: "string",
                            description: "Name of the currency rate source",
                            example: "Central Myanmar Official Exchange"
                        }
                    }
                },
                SourceListResponse: {
                    type: "object",
                    required: ["message", "uploader", "totalCount", "skip", "limit", "data"],
                    properties: {
                        message: {
                            type: "string",
                            description: "Status message for the request",
                            example: "Sources retrieved successfully."
                        },
                        uploader: {
                            type: "string",
                            description: "Username of the uploader",
                            example: "admin123"
                        },
                        totalCount: {
                            type: "integer",
                            description: "Total number of sources available",
                            example: 7
                        },
                        skip: {
                            type: "integer",
                            description: "Number of items skipped for pagination",
                            example: 0
                        },
                        limit: {
                            type: "integer",
                            description: "Maximum number of items returned",
                            example: 10
                        },
                        data: {
                            type: "array",
                            description: "List of sources",
                            items: {
                                $ref: "#/components/schemas/SourceItem"
                            }
                        }
                    }
                },
                CurrencyRate: {
                    type: "object",
                    required: [
                        "currencyCode",
                        "buyRate",
                        "sellRate",
                        "uploadedDate",
                        "uploadedBy",
                        "source"
                    ],
                    properties: {
                        _id: {
                            type: "string",
                            description: "Unique ID of the currency rate record",
                            example: "6512bd43d9caa6e02c990b0a"
                        },
                        currencyCode: {
                            type: "string",
                            description: "The 3-letter ISO currency code",
                            example: "USD"
                        },
                        currencyName: {
                            type: "string",
                            description: "Full name of the currency",
                            example: "United States Dollar"
                        },
                        currencyIcon: {
                            type: "string",
                            description: "Optional currency symbol or emoji",
                            example: "$"
                        },
                        unit: {
                            type: "number",
                            description: "Unit of the currency (e.g., 1, 100)",
                            example: 1
                        },
                        buyRate: {
                            type: "number",
                            description: "Buy rate of the currency",
                            example: 2100.5
                        },
                        sellRate: {
                            type: "number",
                            description: "Sell rate of the currency",
                            example: 2150.25
                        },
                        uploadedDate: {
                            type: "string",
                            format: "date-time",
                            description: "Date when the rate was uploaded (Yangon timezone)",
                            example: "2025-09-03 09:30:10"
                        },
                        uploadedBy: {
                            type: "string",
                            description: "Username of the uploader",
                            example: "admin"
                        },
                        source: {
                            type: "string",
                            description: "Source of the currency rate",
                            example: "defaultSource"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Record creation timestamp",
                            example: "2025-09-03T09:00:00+06:30"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Last update timestamp",
                            example: "2025-09-03T09:30:00+06:30"
                        },
                        percentageChange: {
                            type: "object",
                            description: "Optional percentage change compared to previous rate",
                            properties: {
                                buyRateChangeInPercentage: {
                                    type: "string",
                                    example: "0.45%"
                                },
                                buyRateChange: {
                                    type: "number",
                                    example: 10.5
                                },
                                sellRateChangeInPercentage: {
                                    type: "string",
                                    example: "0.47%"
                                },
                                sellRateChange: {
                                    type: "number",
                                    example: 10.1
                                }
                            }
                        },
                        currencyInfo: {
                            type: "object",
                            description: "Optional additional currency info from CurrencyList helper",
                            example: {
                                name: "United States Dollar",
                                icon: "$"
                            }
                        }
                    }
                },
                TokenValidationResponse: {
                    type: "object",
                    required: ["message", "user"],
                    properties: {
                        message: { type: "string", description: "Status message for token validation", example: "Token is valid!" },
                        user: {
                            type: "object",
                            required: ["_id", "username", "email", "role", "createdAt", "updatedAt", "id"],
                            properties: {
                                _id: { type: "string", description: "MongoDB unique ID of the user", example: "68adc1d7f8d899baab44d774" },
                                username: { type: "string", description: "Username of the user", example: "admin123" },
                                email: { type: "string", format: "email", description: "Email of the user", example: "defaultadmin@example.com" },
                                role: { type: "string", description: "User role", example: "admin" },
                                createdAt: { type: "string", format: "date-time", description: "Account creation timestamp", example: "2025-08-26 20:46:55" },
                                updatedAt: { type: "string", format: "date-time", description: "Last update timestamp", example: "2025-08-26T14:16:55.222Z" },
                            }
                        }
                    }
                },
                LoginResponse: {
                    type: "object",
                    required: ["message", "accountId", "token"],
                    properties: {
                        message: {
                            type: "string",
                            description: "Status message for login",
                            example: "Login/Sign Up successful"
                        },
                        accountId: {
                            type: "string",
                            description: "MongoDB ID of the logged-in account",
                            example: "68adc1d7f8d899baab44d774"
                        },
                        token: {
                            type: "string",
                            description: "JWT token to be used for authenticated requests",
                            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        }
                    }
                }
            }
        },
    },
    apis: ['./Routers/UserRouter.js', './Routers/CurrencyRouter.js', './Routers/TutorialRouter.js','./Routers/*.js'],
};

module.exports = swaggerOptions;