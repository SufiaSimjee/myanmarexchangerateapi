const CurrencyRate = require("../CurrencyRateSchema");
const moment = require("moment-timezone");


const currencyRateJson = [
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4275,
        "sellRate": 4360,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4975,
        "sellRate": 5075,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5755,
        "sellRate": 5875,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3320,
        "sellRate": 3390,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 597,
        "sellRate": 609,
        "uploadedDate": "2025-08-27T16:28:58",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4275.00,
        "sellRate": 4360.00,
        "uploadedDate": "2025-08-27T10:35:28",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4975.00,
        "sellRate": 5075.00,
        "uploadedDate": "2025-08-27T10:35:28",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3320.00,
        "sellRate": 3390.00,
        "uploadedDate": "2025-08-27T10:36:16",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-08-27T10:37:32",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.97,
        "sellRate": 29.55,
        "uploadedDate": "2025-08-27T10:38:30",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1013.00,
        "sellRate": 1033.00,
        "uploadedDate": "2025-08-27T10:39:21",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 597.00,
        "sellRate": 609.00,
        "uploadedDate": "2025-08-27T10:40:02",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.07,
        "sellRate": 3.13,
        "uploadedDate": "2025-08-27T10:40:52",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5755.00,
        "sellRate": 5875.00,
        "uploadedDate": "2025-08-27T10:42:25",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2835.00,
        "uploadedDate": "2025-08-27T10:43:49",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3090.00,
        "sellRate": 3155.00,
        "uploadedDate": "2025-08-27T10:47:47",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 140.00,
        "sellRate": 143.00,
        "uploadedDate": "2025-08-27T10:48:39",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1164.00,
        "sellRate": 1188.00,
        "uploadedDate": "2025-08-27T10:51:24",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.70,
        "sellRate": 49.68,
        "uploadedDate": "2025-08-27T10:53:20",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 549.00,
        "sellRate": 560.00,
        "uploadedDate": "2025-08-27T10:54:26",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 532.00,
        "sellRate": 543.00,
        "uploadedDate": "2025-08-27T10:56:07",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-08-27T10:57:17",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-27T10:57:34",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-08-27T10:57:54",
        "source": "Exchange Myanmar"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 132.00,
        "sellRate": 135.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4280.00,
        "sellRate": 4330.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5030.00,
        "sellRate": 5100.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2810.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3380.00,
        "sellRate": 3420.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1030.00,
        "sellRate": 1035.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 595.00,
        "sellRate": 605.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5830.00,
        "sellRate": 5885.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.00,
        "sellRate": 30.00,
        "uploadedDate": "2025-08-25T09:30:00",
        "source": "Central Myanmar Official Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4300.00,
        "sellRate": 4350.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5000.00,
        "sellRate": 5150.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3370.00,
        "sellRate": 3430.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1020.00,
        "sellRate": 1070.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 134.00,
        "sellRate": 136.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 580.00,
        "sellRate": 620.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.00,
        "sellRate": 30.50,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 6000.00,
        "sellRate": 6100.00,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 2.90,
        "sellRate": 2.90,
        "uploadedDate": "2025-08-27T09:58:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4255.00,
        "sellRate": 4355.00,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4955.00,
        "sellRate": 5060.00,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3310.00,
        "sellRate": 3385.00,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1009.47,
        "sellRate": 1029.50,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 595.19,
        "sellRate": 607.49,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.17,
        "sellRate": 134.45,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.84,
        "sellRate": 29.43,
        "uploadedDate": "2025-08-27T10:30:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4255.00,
        "sellRate": 4355.00,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4960.00,
        "sellRate": 5070.00,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3315.00,
        "sellRate": 3395.00,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1011.39,
        "sellRate": 1031.42,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 596.33,
        "sellRate": 608.62,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.27,
        "sellRate": 134.62,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.90,
        "sellRate": 29.49,
        "uploadedDate": "2025-08-26T17:14:00",
        "source": "MM Exchange"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5710.00,
        "sellRate": 5710.00,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4450.00,
        "sellRate": 4450.00,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5095.00,
        "sellRate": 5095.00,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3420.00,
        "sellRate": 3420.00,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 31.00,
        "sellRate": 31.00,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 6.10,
        "sellRate": 6.10,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1052.00,
        "sellRate": 1052.00,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 7.45,
        "sellRate": 7.45,
        "uploadedDate": "2025-08-26T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5710.00,
        "sellRate": 5710.00,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4410.00,
        "sellRate": 4410.00,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5095.00,
        "sellRate": 5095.00,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3390.00,
        "sellRate": 3390.00,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 31.00,
        "sellRate": 31.00,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 6.10,
        "sellRate": 6.10,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1060.00,
        "sellRate": 1060.00,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 7.40,
        "sellRate": 7.40,
        "uploadedDate": "2025-08-24T09:00:00",
        "source": "Myanmar Sansan Money Exchange"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4260.00,
        "sellRate": 4345.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4965.00,
        "sellRate": 5065.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5760.00,
        "sellRate": 5875.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3315.00,
        "sellRate": 3385.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 596.00,
        "sellRate": 608.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1007.00,
        "sellRate": 1027.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.89,
        "sellRate": 29.48,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.07,
        "sellRate": 3.13,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1159.00,
        "sellRate": 1183.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 139.00,
        "sellRate": 142.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2775.00,
        "sellRate": 2830.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2495.00,
        "sellRate": 2545.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3090.00,
        "sellRate": 3150.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 546.00,
        "sellRate": 557.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.65,
        "sellRate": 49.62,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 530.00,
        "sellRate": 541.00,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1000,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.58,
        "sellRate": 76.08,
        "uploadedDate": "2025-08-28T09:19:11",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4300.00,
        "sellRate": 4350.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 5000.00,
        "sellRate": 5150.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3370.00,
        "sellRate": 3430.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1020.00,
        "sellRate": 1070.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 134.00,
        "sellRate": 136.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 580.00,
        "sellRate": 620.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.00,
        "sellRate": 30.50,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 6000.00,
        "sellRate": 6100.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 2.90,
        "sellRate": 3.30,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1160.00,
        "sellRate": 1193.00,
        "uploadedDate": "2025-08-28T09:05:00",
        "source": "Ngwe Zay"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4275.00,
        "sellRate": 4360.00,
        "uploadedDate": "2025-08-29 09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4260.00,
        "sellRate": 4360.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.88,
        "sellRate": 135.29,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 598.00,
        "sellRate": 613.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3331.00,
        "sellRate": 3417.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1015.00,
        "sellRate": 1041.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4958.00,
        "sellRate": 5086.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.01,
        "sellRate": 29.76,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.07,
        "sellRate": 3.15,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1162.00,
        "sellRate": 1192.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2787.00,
        "sellRate": 2859.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 547.00,
        "sellRate": 561.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 531.00,
        "sellRate": 545.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 140.00,
        "sellRate": 143.00,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.09,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "LAK",
        "unit": 1000,
        "buyRate": 0.20,
        "sellRate": 0.20,
        "uploadedDate": "2025-08-29T11:01:00",
        "source": "Market Price Pro"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4360.00,
        "sellRate": 4360.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4980.00,
        "sellRate": 5080.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5770.00,
        "sellRate": 5885.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3330.00,
        "sellRate": 3400.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 132.45,
        "sellRate": 135.14,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 599.00,
        "sellRate": 611.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1015.00,
        "sellRate": 1035.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.11,
        "sellRate": 29.70,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.08,
        "sellRate": 3.14,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1163.00,
        "sellRate": 1186.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 139.00,
        "sellRate": 142.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2795.00,
        "sellRate": 2850.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2520.00,
        "sellRate": 2570.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3105.00,
        "sellRate": 3170.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 549.00,
        "sellRate": 560.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.77,
        "sellRate": 49.76,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 532.00,
        "sellRate": 543.00,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1000,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.86,
        "sellRate": 76.38,
        "uploadedDate": "2025-08-29T12:03:24",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4275.00,
        "sellRate": 4360.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4980.00,
        "sellRate": 5080.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5770.00,
        "sellRate": 5885.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3330.00,
        "sellRate": 3400.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 132.45,
        "sellRate": 135.14,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 599.00,
        "sellRate": 611.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1015.00,
        "sellRate": 1035.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 29.11,
        "sellRate": 29.70,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.08,
        "sellRate": 3.14,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1163.00,
        "sellRate": 1186.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 139.00,
        "sellRate": 142.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2795.00,
        "sellRate": 2850.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2520.00,
        "sellRate": 2570.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3105.00,
        "sellRate": 3170.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 549.00,
        "sellRate": 560.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.77,
        "sellRate": 49.76,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 532.00,
        "sellRate": 543.00,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1000,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.86,
        "sellRate": 76.38,
        "uploadedDate": "2025-08-30T09:00:21",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4245.00,
        "sellRate": 4330.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4960.00,
        "sellRate": 5060.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5735.00,
        "sellRate": 5850.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3310.00,
        "sellRate": 3380.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 596.00,
        "sellRate": 608.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1005.00,
        "sellRate": 1025.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.88,
        "sellRate": 29.46,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.06,
        "sellRate": 3.12,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1156.00,
        "sellRate": 1179.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 139.00,
        "sellRate": 142.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2835.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2500.00,
        "sellRate": 2550.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3090.00,
        "sellRate": 3150.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 545.00,
        "sellRate": 556.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.16,
        "sellRate": 49.13,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 528.00,
        "sellRate": 539.00,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.28,
        "sellRate": 75.77,
        "uploadedDate": "2025-08-31T09:30:00",
        "source": "Myanmar Market Price"
    },

    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4250.00,
        "sellRate": 4340.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4975.00,
        "sellRate": 5075.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5750.00,
        "sellRate": 5865.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3310.00,
        "sellRate": 3380.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 596.00,
        "sellRate": 608.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1005.00,
        "sellRate": 1025.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.91,
        "sellRate": 29.49,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.05,
        "sellRate": 3.12,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1157.00,
        "sellRate": 1180.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 139.00,
        "sellRate": 142.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2785.00,
        "sellRate": 2840.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2510.00,
        "sellRate": 2560.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3095.00,
        "sellRate": 3160.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 546.00,
        "sellRate": 557.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.24,
        "sellRate": 49.21,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 529.00,
        "sellRate": 540.00,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.16,
        "sellRate": 75.65,
        "uploadedDate": "2025-09-01T09:18:00",
        "source": "Myanmar Market Price"
    },

    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4245.00,
        "sellRate": 4330.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4965.00,
        "sellRate": 5065.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5745.00,
        "sellRate": 5860.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3310.00,
        "sellRate": 3380.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 594.00,
        "sellRate": 606.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1003.00,
        "sellRate": 1023.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.75,
        "sellRate": 29.33,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.05,
        "sellRate": 3.11,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1156.00,
        "sellRate": 1179.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 138.00,
        "sellRate": 141.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2835.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2500.00,
        "sellRate": 2550.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3085.00,
        "sellRate": 3150.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 544.00,
        "sellRate": 555.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.21,
        "sellRate": 49.18,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 527.00,
        "sellRate": 538.00,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.16,
        "sellRate": 75.65,
        "uploadedDate": "2025-09-02T09:07:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4265.00,
        "sellRate": 4350.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4960.00,
        "sellRate": 5060.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5700.00,
        "sellRate": 5815.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3310.00,
        "sellRate": 3380.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 597.00,
        "sellRate": 609.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1008.00,
        "sellRate": 1028.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.67,
        "sellRate": 29.25,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.06,
        "sellRate": 3.12,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1161.00,
        "sellRate": 1185.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 139.00,
        "sellRate": 142.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2780.00,
        "sellRate": 2835.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2495.00,
        "sellRate": 2545.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3090.00,
        "sellRate": 3155.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 546.00,
        "sellRate": 557.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.42,
        "sellRate": 49.40,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.21,
        "sellRate": 75.71,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 530.00,
        "sellRate": 540.00,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.20,
        "sellRate": 0.21,
        "uploadedDate": "2025-09-03T09:10:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4230.00,
        "sellRate": 4315.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4920.00,
        "sellRate": 5015.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5650.00,
        "sellRate": 5765.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3300.00,
        "sellRate": 3370.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 130.72,
        "sellRate": 133.33,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 593.00,
        "sellRate": 604.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1000.00,
        "sellRate": 1020.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.44,
        "sellRate": 29.01,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.04,
        "sellRate": 3.10,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1150.00,
        "sellRate": 1175.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 138.00,
        "sellRate": 141.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2760.00,
        "sellRate": 2815.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2475.00,
        "sellRate": 2525.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3070.00,
        "sellRate": 3130.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 543.00,
        "sellRate": 553.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.01,
        "sellRate": 48.97,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 526.00,
        "sellRate": 536.00,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1,
        "buyRate": 0.19,
        "sellRate": 0.20,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.05,
        "sellRate": 1.07,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 73.87,
        "sellRate": 75.34,
        "uploadedDate": "2025-09-03T14:33:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "USD",
        "unit": 1,
        "buyRate": 4250.00,
        "sellRate": 4335.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "EUR",
        "unit": 1,
        "buyRate": 4950.00,
        "sellRate": 5050.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "GBP",
        "unit": 1,
        "buyRate": 5705.00,
        "sellRate": 5820.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3300.00,
        "sellRate": 3370.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 595.00,
        "sellRate": 607.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1005.00,
        "sellRate": 1025.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.66,
        "sellRate": 29.24,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.05,
        "sellRate": 3.11,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "INR",
        "unit": 1,
        "buyRate": 48.22,
        "sellRate": 49.20,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MOP",
        "unit": 1,
        "buyRate": 528.00,
        "sellRate": 539.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "VND",
        "unit": 1,
        "buyRate": 0.16,
        "sellRate": 0.17,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "LAK",
        "unit": 1000,
        "buyRate": 0.19,
        "sellRate": 0.20,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KHR",
        "unit": 1,
        "buyRate": 1.06,
        "sellRate": 1.08,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "PHP",
        "unit": 1,
        "buyRate": 74.25,
        "sellRate": 75.75,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AED",
        "unit": 1,
        "buyRate": 1157.00,
        "sellRate": 1180.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "TWD",
        "unit": 1,
        "buyRate": 138.00,
        "sellRate": 141.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "AUD",
        "unit": 1,
        "buyRate": 2775.00,
        "sellRate": 2830.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "NZD",
        "unit": 1,
        "buyRate": 2495.00,
        "sellRate": 2545.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CAD",
        "unit": 1,
        "buyRate": 3075.00,
        "sellRate": 3140.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "HKD",
        "unit": 1,
        "buyRate": 545.00,
        "sellRate": 556.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },

    {
        "currencyCode": "SGD",
        "unit": 1,
        "buyRate": 3300.00,
        "sellRate": 3370.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "THB",
        "unit": 1,
        "buyRate": 131.58,
        "sellRate": 134.23,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "CNY",
        "unit": 1,
        "buyRate": 595.00,
        "sellRate": 607.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "MYR",
        "unit": 1,
        "buyRate": 1005.00,
        "sellRate": 1025.00,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "JPY",
        "unit": 1,
        "buyRate": 28.66,
        "sellRate": 29.24,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    },
    {
        "currencyCode": "KRW",
        "unit": 1,
        "buyRate": 3.05,
        "sellRate": 3.11,
        "uploadedDate": "2025-09-04T09:55:00",
        "source": "Myanmar Market Price"
    }
];


const CurrencyRates = currencyRateJson.map(rate =>
    new CurrencyRate({
        currencyCode: rate.currencyCode,
        unit: rate.unit,
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
        source: rate.source,
        uploadedDate: moment.tz(rate.uploadedDate, "Asia/Yangon").toDate(),
        uploadedBy: process.env.DEFAULT_ADMIN_USERNAME
    })
);

async function seedCurrencyRates() {
    try {

        let documentCount = await CurrencyRate.countDocuments();
        if(documentCount < 1){
            for (const currency of CurrencyRates) {
                await currency?.save();
                console.log(`Saved currency rate: ${currency?._id}`);
            }
        } else {
            console.log("Currency rate seeds already exist, skipping seeding.");
        }
        return true

    } catch (err) {
        console.error("Error seeding CurrencyRates:", err);
        return false
    }
}

module.exports = seedCurrencyRates;
