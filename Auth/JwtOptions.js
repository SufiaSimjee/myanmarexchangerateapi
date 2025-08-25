const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
    secretOrKey:  process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports =  jwtOptions;