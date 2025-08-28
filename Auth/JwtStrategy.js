const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;

const User = require('../Models/UserSchema');
const jwtOptions = require("./JwtOptions");
const {connectDb, closeDb} = require("../Services/DbService");



const jwtVerify = async (payload, done) => {
    let dbConnection;
    try {
        dbConnection = await connectDb();
        const user = await User.findOne({
            $or: [
                { email: payload.email },
                { username: payload.username },
            ]
        });

        if (!user) {
            done(null, false)
        }

        delete user.password;
        done(null, user);

    } catch(err) {
        console.error(err);
        done(null, false);

    } finally {
        await closeDb(dbConnection);
    }
};



const strategy = new JwtStrategy(jwtOptions, jwtVerify)



module.exports = strategy;