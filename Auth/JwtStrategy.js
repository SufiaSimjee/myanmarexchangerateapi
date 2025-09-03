const passportJWT = require("passport-jwt");
const JwtStrategy = passportJWT.Strategy;

const User = require('../Models/UserSchema');
const jwtOptions = require("./JwtOptions");



const jwtVerify = async (payload, done) => {
    try {
        const user = await User.findOne({
            $or: [
                { email: payload.email },
                { username: payload.username },
            ]
        });

        if (!user) {
            done(null, false)
        }

        try{
            if(user?.password) {
                delete user?.password;
            }
        } catch(e){
            console.log(e);
        }

        done(null, user);

    } catch(err) {
        console.error(err);
        done(null, false);
    }
};



const strategy = new JwtStrategy(jwtOptions, jwtVerify)



module.exports = strategy;