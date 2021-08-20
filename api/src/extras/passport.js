const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const path = require('path');
const { User } = require('../db.js');


const pathToKey = path.join(__dirname, '.', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, async (jwt_payload, done) => {

        console.log(jwt_payload);
        
        // We will assign the `sub` property on the JWT to the database ID of user
        try {
            const user = await User.findOne({where: {id: jwt_payload.sub}});
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(err, false);
        }   
    }));
}