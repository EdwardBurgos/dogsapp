const { Router } = require('express');
const axios = require('axios').default;
const { Temperament, Dog, DogTemperament, User } = require('../db.js');
const utils = require('../extras/utils.js');
const countries = require('../extras/countries')
const passport = require('passport');
const { Op } = require('sequelize');

function justImportantInfo(arr, moredetails) {
    if (moredetails) return arr.slice(0, 8).map((e) => {
        return {
            id: e.id, image: e.image.url, name: e.name, temperament: e.temperament,
            height: e.height.metric, weight: e.weight.metric, lifespan: e.life_span
        }
    });
    return arr.slice(0, 8).map((e) => { return { id: e.id, image: e.image.url, name: e.name, temperament: e.temperament } });
}

const router = Router();

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "You are successfully authenticated to this route!" });
});

// Returns true if there is no user with that email or false is there is one
router.get('/availableEmail/:email', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        return res.send(user ? false : true);
    } catch (e) {
        next(e)
    }
})

// Returns true if there is no user with that email or false is there is one
router.get('/availableUsername/:username', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { username: req.params.username } });
        return res.send(user ? false : true);
    } catch (e) {
        next(e)
    }
})

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
                return user ? res.send({ success: true, user: user.fullname }) : res.status(400).send({ success: false, msg: 'Sorry, an error occurred' })
            } else { return res.status(409).send({ success: false, msg: 'There is already a user with this email' }) }
        } else { return res.status(409).send({ success: false, msg: 'There is already a user with this username' }) }
    } catch {
        return res.status(400).send({ success: false, msg: 'Sorry, an error occurred' })
    }
})

// Validate an existing user and issue a JWT
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

// Change the password
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
            const newUser = await user.update({ hash, salt, type: 'Native'});
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

router.get('/', async (req, res) => {
    try {
        const { name, temperament } = req.query;
        const response = await axios.get(`https://api.thedogapi.com/v1/breeds`);
        if (name) {
            var newResponse = response.data.filter((e) => e.name.toLowerCase().includes(name.toLowerCase()))
            if (newResponse.length) return res.json(justImportantInfo(newResponse));
            return res.json('No se encontraron razas de perros coincidente con ' + name);
        }
        if (temperament) {
            var filterTemperaments = response.data.filter((e) => e.temperament ? e.temperament.toLowerCase().includes(temperament.toLowerCase()) : false)
            if (filterTemperaments.length) return res.json(justImportantInfo(filterTemperaments));
            return res.json('No se encontraron razas de perros coincidente con el temperamento ' + temperament);
        }
        res.json(justImportantInfo(response.data));
    } catch (e) {
        res.status(404).json({ error: 'Se produjo este error > ' + e });
    }
})

router.get('/all', async (req, res) => {
    try {
        const { name, temperament } = req.query;
        let responseNotOwn = await axios.get(`https://api.thedogapi.com/v1/breeds`);
        let responseOwn = await Dog.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: Temperament,
                    as: "temperaments",
                    attributes: ["id", "name"]
                },
            ],
        });
        if (responseOwn.length) {
            responseOwn = responseOwn.map(e => {
                return {
                    id: e.dataValues.id,
                    image: 'https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg',
                    name: e.dataValues.name,
                    temperament: e.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g, ', '),
                }
            })
        }
        responseNotOwn = responseNotOwn.data.map((e) => { return { id: e.id, image: e.image.url, name: e.name, temperament: e.temperament } })
        let completeList = [...responseNotOwn, ...responseOwn];
        if (name) {
            var newResponse = completeList.filter((e) => e.name.toLowerCase().includes(name.toLowerCase()))
            if (newResponse.length) return res.json(newResponse);
            return res.json('No se encontraron razas de perros coincidente con ' + name);
        }
        res.json(completeList)

    } catch (e) {
        res.status(404).json({ error: 'Se produjo este error > ' + e });
    }
})

router.get('/own', async (req, res) => {
    try {
        // const response = await Dog.findAll({ attributes: ['id', 'name'] });

        const response = await Dog.findAll({
            attributes: ['id', 'name'],
            include: [
                {
                    model: Temperament,
                    as: "temperaments",
                    attributes: ["id", "name"]
                },
            ],
        });
        console.log(response);
        if (response.length) {
            return res.json(response.map(e => {
                return {
                    id: e.dataValues.id,
                    image: 'https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg',
                    name: e.dataValues.name,
                    temperament: e.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g, ', '),
                }
            }))
        }
        // console.log(response)
        // if (response.length) return res.json(response);
        res.json('Not own dogs found');
        //https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg
    } catch (e) {
        res.status(404).json({ error: 'This error occurred > ' + e });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const responseDogs = await Dog.findOne({
            where: { id: parseInt(req.params.id) },
            include: [
                {
                    model: Temperament,
                    as: "temperaments",
                    attributes: ["id", "name"]
                },
            ],
        });
        if (responseDogs) {
            return res.json({
                id: responseDogs.dataValues.id,
                image: 'https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg',
                name: responseDogs.dataValues.name,
                temperament: responseDogs.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g, ', '),
                height: `${responseDogs.dataValues.heightmin} - ${responseDogs.dataValues.heightmax}`,
                weight: `${responseDogs.dataValues.weightmin} - ${responseDogs.dataValues.weightmax}`,
                lifespan: `${responseDogs.dataValues.lifespanmin} - ${responseDogs.dataValues.lifespanmax} years`
            })
        }


        //         const regex = /Dog/ig; 
        // La i es para case insensitive
        // console.log(p.replaceAll(/,/ig, ', '));
        //.replace(/{name}/g, objeto.name) 


        //if (responseDogs) {const responseDogTemps = await DogTemperament.findAll({where: {dogId: req.params.id}});}
        //console.log(responseDogTemps);


        // const {id, name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin}


        //     updatedAt: 2021-06-22T20:57:01.442Z
        //   });}




        // console.log(response)
        // return res.json(
        //     id: , image: e.image.url, name: e.name, temperament: e.temperament, 
        //                     height: e.height.metric, weight: e.weight.metric, lifespan: e.life_span}


        //     {id: ,name: 'Chusco',heightmax: 80,




        //     heightmin: 50,
        //     weightmax: 90,
        //     weightmin: 85,
        //     lifespanmax: 89,
        //     lifespanmin: 56,
        //     createdAt: 2021-06-22T20:57:01.442Z,
        //     updatedAt: 2021-06-22T20:57:01.442Z
        //   });

        // dataValues: {
        //     id: 265,
        //     name: 'Chusco',
        //     heightmax: 80,
        //     heightmin: 50,
        //     weightmax: 90,
        //     weightmin: 85,
        //     lifespanmax: 89,
        //     lifespanmin: 56,
        //     createdAt: 2021-06-22T20:57:01.442Z,
        //     updatedAt: 2021-06-22T20:57:01.442Z
        //   },




        /* if (!filterResponse.length) {
             await Dog.findOne({where: {id: parseInt(req.params.id)}});
             res.json()
         }*/


        const response = await axios.get('https://api.thedogapi.com/v1/breeds');
        const filterResponse = response.data.filter((e) => e.id === parseInt(req.params.id));
        if (filterResponse.length) return res.json(justImportantInfo(filterResponse, true)[0]);

        res.json('No se encontró una raza de id ' + req.params.id);
    } catch (e) {
        res.status(404).json({ error: 'Se produjo este error > ' + e });
    }
})

/*router.get('/all', async (req, res) => {
    try {
        const responseNotOwn = await axios.get('https://api.thedogapi.com/v1/breeds');
        const responseOwn =  Dog.findAll(attributes: ['foo', 'bar'])); 
        const filterResponse = response.data.filter((e) => e.id === parseInt(req.params.id));
        if (filterResponse.length) return res.json(justImportantInfo(filterResponse, true));
        res.json('No se encontró una raza de id ' + req.params.id);
    } catch (e) {
        res.status(404).json({error: 'Se produjo este error > ' + e});
    }
})*/





module.exports = router;