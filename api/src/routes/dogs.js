const { Router } = require('express');
const axios = require('axios').default;
const { Temperament, Dog, DogTemperament, Pet, Like, User } = require('../db.js');
const router = Router();
const passport = require('passport');
const { Op } = require('sequelize');


// This route allows us to create a new dog breed
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, bred_for, breed_group, origin, image, temperaments } = req.body;
        if (await Dog.findOne({ where: { name } })) {
            return res.status(409).send(`The dog breed ${req.body.name} already exists`);
        } else {
            const razaCreada = await Dog.create({ name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, bred_for, breed_group, origin, image, userId: req.user.id });
            if (razaCreada) {
                temperaments.forEach(async (e) => {
                    var foundTemperament = await Temperament.findOne({ where: { name: e } });
                    if (foundTemperament) { razaCreada.addTemperament(foundTemperament) }
                });
                res.send({ message: `The dog breed ${name} was created successfully`, id: razaCreada.id });
            } else {
                next()
            }
        }
    } catch (e) {
        next()
    }
})

// This route allows us to get all the dog breeds
router.get('/all', async (req, res, next) => {
    try {
        let responseOwn = await Dog.findAll({
            attributes: ['id', 'name', 'image'],
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
                    image: e.dataValues.image,
                    name: e.dataValues.name,
                    temperament: e.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g, ', '),
                }
            })
            res.send(responseOwn)
        } else {
            res.status(404).send('No dog breeds found')
        }
    } catch (e) {
        next()
    }
})

// This route allows us to get all the dogs name to be used in a select input
router.get('/', async (req, res, next) => {
    try {
        const dogs = await Dog.findAll({ attributes: ['id', 'name'] })
        return res.send(dogs.map(e => e.dataValues))
    } catch (e) {
        next()
    }
})


// This route allows us to get the dog breeds created by a user
router.get('/own', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        let responseOwn = await Dog.findAll({
            where: {
                [Op.and]:
                    [
                        { userId: req.user.id }
                    ]
            },
            attributes: ['id', 'name', 'image'],
            include: [
                {
                    model: Temperament,
                    as: "temperaments",
                    attributes: ["id", "name"]
                }
            ],
        });
        if (responseOwn.length) {
            responseOwn = responseOwn.map(e => {
                return {
                    id: e.dataValues.id,
                    image: e.dataValues.image,
                    name: e.dataValues.name,
                    temperament: e.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g, ', '),
                }
            })
            res.send(responseOwn)
        } else {
            res.status(404).send('You have not created any dog breed yet')
        }
    } catch (e) {
        next()
    }
})

// This route allows us to get dog by id
router.get('/:id', async (req, res, next) => {
    try {
        const dog = await Dog.findOne({
            where: { id: parseInt(req.params.id) },
            include: [
                {
                    model: Temperament,
                    as: "temperaments",
                    attributes: ["id", "name"]
                },
                {
                    model: Pet,
                    as: "pets",
                    attributes: ["id", "name", "photo"],
                    include: [
                        {
                            model: Like,
                            as: "likes",
                            include: [
                                {
                                    model: User,
                                    as: "user"
                                }
                            ]
                        },
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
        });     
        if (dog) {
            const { id, name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, bred_for, breed_group, origin, image, temperaments, pets, userId } = dog.dataValues;
            res.send({
                id,
                image,
                name,
                temperament: temperaments.map(e => e.dataValues.name).toString().replace(/,/g, ', '),
                temperamentsArray: temperaments.map(e => e.dataValues.name),
                height: `${heightmin ? heightmin : ''}${heightmin && heightmax ? ' - ' : ''}${heightmax ? heightmax : ''}${heightmin || heightmax ? ' cm' : ''}`,
                heightmin,
                heightmax,
                weight: `${weightmin ? weightmin : ''}${weightmin && weightmax ? ' - ' : ''}${weightmax ? weightmax : ''}${weightmin || weightmax ? ' kg' : ''}`,
                weightmin,
                weightmax,
                lifespan: `${lifespanmin ? lifespanmin : ''}${lifespanmin && lifespanmax ? ' - ' : ''}${lifespanmax ? lifespanmax : ''}${lifespanmin || lifespanmax ? ' years' : ''}`,
                lifespanmin,
                lifespanmax,
                bred_for,
                breed_group,
                origin,
                image,
                pets: dog.dataValues.pets.map(e => Object.assign(e.dataValues, {likes: e.dataValues.likes.map(e => e.dataValues ? (({ id, username, fullname, profilepic }) => ({ id, username, fullname, profilepic }))(e.dataValues.user) : null)}, { likesCount: e.dataValues.likes.length }, {user: (({ fullname, profilepic, username }) => ({ fullname, profilepic, username }))(e.dataValues.user)})),
                userId
            })
        } else {
            res.status(404).send(`There is no dog breed with the id ${req.params.id}`);
        }
    } catch (e) {
        console.log(e)
        next();
    }
})

// This route allow us to update the dog breed of a user
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { id, name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, bred_for, breed_group, origin, image, temperaments } = req.body;
        if (!id || !name || !image) return res.status(400).send('Please provide a name and a link of a photo and the dog breed you want to update');
        const dog = await Dog.findOne({
            where: { id },
            include: [
                {
                    model: Temperament,
                    as: "temperaments",
                },
            ],
        })
        if (dog) {
            if (dog.userId === req.user.id) {
                const dogUpdated = await dog.update({ name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, bred_for, breed_group, origin, image });
                if (dogUpdated) {
                    const newTemperaments = await Promise.all(temperaments.map(async (e) => {
                        var foundTemperament = await Temperament.findOne({ where: { name: e } });
                        return foundTemperament ? foundTemperament.id : null
                    }))
                    const dogTemperaments = await dogUpdated.setTemperaments(newTemperaments.filter(e => e !== null))
                    return res.send({ message: `The dog breed ${dogUpdated.name} was updated successfully`, id: dogUpdated.id })
                } else {
                    return res.status(500).send(`Sorry, the dog breed with the id ${id} can not be updated`)
                }
            } else {
                return res.status(401).send(`You can not edit this dog breed beacuse is not yours`);
            }
        } else {
            return res.status(404).send(`There is no dog breed with the id ${id}`);
        }
    } catch (e) {
        if (e.original.code === '23503' && e.original.detail.includes('temperamentId')) return res.status(409).send(`Provide valid temperaments`);
        if (e.original.code === '23505' && e.original.detail.includes('name')) return res.status(409).send(`The dog breed ${req.body.name} already exists`);
        next()
    }
})

// This route allow us to delete the dog breed of a user 
router.delete('/:dog', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.params.dog) return res.send(400).send('Please provide a dog')
        const dog = await Dog.findOne({
            where: { id: req.params.dog }
        })
        if (dog) {
            if (dog.userId === req.user.id) {
                const dogDeleted = await dog.destroy();
                !dogDeleted.length ? res.send(`The dog breed with the id ${req.params.dog} was deleted successfully`) : res.status(500).send(`Sorry, the dog breed with the id ${req.params.dog} can not be deleted`)
            } else {
                return res.status(404).send(`You can not delete this dog breed because is not yours`);
            }
        } else {
            res.status(404).send(`There is no dog breed with the id ${id}`);
        }
    } catch (e) {
        next()
    }
})

module.exports = router;