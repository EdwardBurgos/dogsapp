const { Router } = require('express');
const axios = require('axios').default;
const { Temperament, Dog, DogTemperament, User, Pet } = require('../db.js');
const utils = require('../extras/utils.js');
const countries = require('../extras/countries')
const passport = require('passport');
const { Op } = require('sequelize');
const { validURL } = require('../extras/ownUtils')

const router = Router();

// This route allows us to create a new pet
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { name, photo, dogId } = req.body;
        if (!name || !photo || !dogId) return res.status(400).send('Please provide a name, a link of a photo and a dog breed');
        if (!validURL(photo)) return res.status(400).send('Please provide a valid link of a photo')
        const petCreated = await Pet.create({ name, photo, dogId, userId: req.user.id });
        petCreated ? res.send({ message: `Your pet ${name} was registered successfully`, id: petCreated.id }) : next()
    } catch (e) {
        next()
    }
})

// This route allows us to get all the dog breeds
router.get('/all/:breedid', async (req, res, next) => {
    try {
        if (!req.params.breedid) return res.status(400).send('Please provide a pet');
        const breedId = req.params.breedid;
        let pets = await Pet.findAll({
            where: {
                dogId: breedId
            }
        });
        if (pets.length) {
            pets = pets.map(e => {
                return {
                    id: e.dataValues.id,
                    name: e.dataValues.name,
                    photo: e.dataValues.photo,
                    userId: e.dataValues.userId
                }
            })
            res.send(pets)
        } else {
            res.status(404).send('No pets found')
        }
    } catch (e) {
        next()
    }
})

// This route allows us to get the pets created by a user
router.get('/own', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        let pets = await Pet.findAll({ where: { userId: req.user.id } });
        if (pets.length) {
            pets = pets.map(e => {
                return {
                    id: e.dataValues.id,
                    name: e.dataValues.name,
                    photo: e.dataValues.photo,
                    userId: e.dataValues.userId
                }
            })
            res.send(pets)
        } else {
            res.status(404).send('You have not register any pet yet')
        }
    } catch (e) {
        next()
    }
})

// This route allows us to get pet by id
router.get('/:id', async (req, res, next) => {
    try {
        const pet = await Pet.findOne({
            where: { id: parseInt(req.params.id) }
        });
        if (pet) {
            const { id, name, photo, dogId } = pet.dataValues;
            res.send({
                id,
                name,
                photo,
                dogId
            })
        } else {
            res.status(404).send(`There is no pet with the id ${req.params.id}`);
        }
    } catch (e) {
        next();
    }
})

// This route allows us to update the dog breed of a user
router.put('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { id, name, photo, dogId } = req.body;
        if (!id || !name || !photo || !dogId) return res.status(400).send('Please provide a name, a link of a photo, a dog breed and the pet you want to update');
        if (!validURL(photo)) return res.status(400).send('Please provide a valid link of a photo')
        const pet = await Pet.findOne({
            where: { id },
        })
        if (pet) {
            if (pet.userId === req.user.id) {
                const petUpdated = await pet.update({ name, photo, dogId });
                petUpdated ? res.send({ message: `The dog breed ${petUpdated.name} was updated successfully`, id: petUpdated.id }) : res.status(500).send(`Sorry, the dog breed with the id ${id} can not be updated`)
            } else {
                return res.status(404).send(`You can not edit this pet beacuse is not yours`);
            }
        } else {
            res.status(404).send(`There is no pet with the id ${id}`);
        }
    } catch (e) {
        next()
    }
})

// This route allow us to delete the pet of a user 
router.delete('/:pet', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        if (!req.params.pet) return res.send(400).send('Please provide a pet')
        const pet = await Pet.findOne({
            where: { id: req.params.pet }
        })
        if (pet) {
            if (pet.userId === req.user.id) {
                const petDeleted = await pet.destroy();
                petDeleted ? res.send({ message: `The pet with the id ${req.params.pet} was updated successfully` }) : res.status(500).send(`Sorry, the pet with the id ${req.params.pet} can not be deleted`)
            } else {
                return res.status(404).send(`You can not delete this pet because is not yours`);
            }
        } else {
            res.status(404).send(`There is no pet with the id ${id}`);
        }
    } catch (e) {
        next()
    }
})

module.exports = router;