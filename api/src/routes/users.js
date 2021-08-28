const { Router } = require('express');
const axios = require('axios').default;
const { User } = require('../db.js');
const utils = require('../extras/utils.js');
const countries = require('../extras/countries')
const passport = require('passport');
const { Op } = require('sequelize');
const router = Router();

// This route allows us to get the email, photo and name of the authentciated user
router.get('/info', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const { id, fullname, name, lastname, profilepic, username, country, email, type } = req.user;
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!", user: { id, fullname, name, lastname, profilepic, username, country, email } });
});

// This route returns true (if there is no user with that email) OR false is there is one
router.get('/availableEmail/:email', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        return res.send(user ? false : true);
    } catch (e) {
        next(e)
    }
})

// This route allows us to register a new user
router.post('/register', async (req, res) => {
    let { fullname, name, lastname, profilepic, username, country, email, password, type } = req.body;
    if (!countries.includes(country)) return res.status(406).send({ success: false, msg: 'This is not a country' })
    try {
        const availableUsername = await User.findOne({ where: { username } })
        if (!availableUsername) {
            const availableEmail = await User.findOne({ where: { email } })
            if (!availableEmail) {
                if (!profilepic) profilepic = "https://firebasestorage.googleapis.com/v0/b/dogsapp-f043d.appspot.com/o/defaultProfilePic.png?alt=media&token=77a0fa3a-c3e3-4e2a-ae91-ac2ffdadbba8";
                const saltHash = utils.genPassword(password);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
                const user = await User.create({ fullname, name, lastname, profilepic, username, country, email, hash, salt, type });
                user ? res.send({ success: true, user: user.fullname }) : res.status(400).send({ success: false, msg: 'Sorry, an error occurred' })
            } else { return res.status(409).send({ success: false, msg: 'There is already a user with this email' }) }
        } else { res.status(409).send({ success: false, msg: 'There is already a user with this username' }) }
    } catch {
        res.status(400).send({ success: false, msg: 'Sorry, an error occurred' })
    }
})

// This route allows us to log in a user validating if exists and issuing a JWT
router.post('/login', async (req, res, next) => {
    try {
        const { emailORusername, password, type } = req.body;
        if (type === 'Google') {
            const user = await User.findOne({ where: { email: emailORusername } });
            if (user) {
                const tokenObject = utils.issueJWT(user);
                res.send({ success: true, user: user.fullname, token: tokenObject.token, expiresIn: tokenObject.expires });
            } else {
                return res.status(404).send({ success: false, msg: "There is no user registered with this email" });
            }
        } else if (type === 'Native') {
            const user = await User.findOne({
                where: {
                    [Op.or]:
                        [
                            { email: emailORusername },
                            { username: emailORusername }
                        ]
                }
            })
            if (user) {
                if (user.type === "Native") {
                    const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
                    if (isValid) {
                        const tokenObject = utils.issueJWT(user);
                        res.send({ success: true, user: user.fullname, token: tokenObject.token, expiresIn: tokenObject.expires });
                    } else {
                        res.status(403).send({ success: false, msg: "Incorrect password" });
                    }
                } else if (user.type === "Google") {
                    res.status(403).send({ success: false, msg: `You were registered with ${user.type}, if you want define a password or login with ${user.type} again` });
                }
            } else {
                return res.status(404).send({ success: false, msg: "There is no user registered with this email" });
            }
        }
    } catch (e) {
        next(e);
    }
});

// This route allows us to change the password
router.post('/changePassword', async (req, res) => {
    try {
        const { emailORusername, password } = req.body;
        const user = await User.findOne({
            where: {
                [Op.or]:
                    [
                        { email: emailORusername },
                        { username: emailORusername }
                    ]
            }
        })
        if (user) {
            const saltHash = utils.genPassword(password);
            const salt = saltHash.salt;
            const hash = saltHash.hash;
            const newUser = await user.update({ hash, salt, type: 'Native' });
            if (newUser) {
                const tokenObject = utils.issueJWT(newUser);
                res.send({ success: true, user: user.fullname, token: tokenObject.token, expiresIn: tokenObject.expires });
            } else {
                return res.status(500).send({ success: false, msg: "Password could not be updated" });
            }
        } else {
            return res.status(404).send({ success: false, msg: "There is no user registered with this email" });
        }
    } catch (e) {
        next(e);
    }
})

router.post('/changePhoto', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            const updated = await user.update({ profilepic: req.body.profilePic })
            return updated ? res.send('Your profile picture was updated successfully') : res.status(500).send('Sorry, your profile picture could not be updated')
        } else { return res.status(404).send('User not found')}
    } catch (e) {
        next()
    }   
})

router.put('/updateUserInfo', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const {name, lastname, username, country} = req.body;
        const user = await User.findOne({ where: { id: req.user.id } });
        if (user) {
            const userAvailability = await User.findOne({ where: { username } });
            if (userAvailability && (JSON.stringify(user) !== JSON.stringify(userAvailability))) return res.status(409).send('There is already a user with this username')
            const updated = await user.update({ fullname: `${name} ${lastname}`, name, lastname, username, country });
            return updated ? res.send('Your information was updated successfully') : res.status(500).send('Sorry, your information could not be updated')
        } else { return res.status(404).send('User not found')}
    } catch (e) {
        console.log(e)
        next()
    }
    
    
})

module.exports = router;