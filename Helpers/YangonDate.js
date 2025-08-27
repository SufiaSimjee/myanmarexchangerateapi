const moment = require("moment-timezone");

function yangonDate(value) {
    try{
        if (!value) {
            return value;
        }
        return moment.utc(value).tz("Asia/Yangon").format("YYYY-MM-DD HH:mm:ss");
    } catch (error) {
        console.log(error);
        return value;
    }
}

module.exports = yangonDate;