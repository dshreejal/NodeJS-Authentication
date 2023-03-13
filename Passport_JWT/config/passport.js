require('dotenv').config();
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');


const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

const verifyCallback = async (jwt_payload, done) => {
    console.log(jwt_payload);
    try {
        const user = await User.findOne({ _id: jwt_payload.id });
        if (!user) {
            done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
};

const strategy = new JwtStrategy(options, verifyCallback);
passport.use(strategy);


