const jwt = require("jsonwebtoken");
const {secretOrKey} = require("./JwtOptions");

function generateJWTToken(userAccount) {
    try{
        let today = new Date();
        let expirationDate = new Date(today);
        expirationDate.setMinutes(today.getMinutes() + 30)

        let payload = {
            id: userAccount._id,
            username: userAccount.username,
            email: userAccount.email,
            role: userAccount.role,
            iat: parseInt(today.getTime() / 1000, 10),
            exp: parseInt(expirationDate.getTime() / 1000, 10),
            sub: userAccount.email,
            iss: 'naingkaungmyatt@icloud.com'
        }


        let token = jwt.sign(payload, secretOrKey)
        return token;
    } catch (error) {
        console.log(error);
    }


}

module.exports = generateJWTToken;