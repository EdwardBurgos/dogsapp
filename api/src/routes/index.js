const { Router } = require('express');
const axios = require('axios').default;
const { Temperament, Dog, DogTemperament } = require('../db.js');
const router = Router();

router.get('/temperament', async (req, res) => {
    try {
        let temperaments = await Temperament.findAll();
        res.json(temperaments.map((e) => { return e.name }));
    } catch (e) {
        res.status(404).json({ error: 'Se produjo este error > ' + e });
    }

})
/* 
[ ] POST /dog:
Recibe los datos recolectados desde el formulario controlado de la ruta de creación de raza de perro por body
Crea una raza de perro en la base de datos
 */
router.post('/dog', async (req, res) => {
    try {
        const { name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin, temperaments } = req.body;
        const razaCreada = await Dog.create({ name, heightmax, heightmin, weightmax, weightmin, lifespanmax, lifespanmin });
        if (razaCreada) {
            temperaments.forEach(async (e) => {
                var foundTemperament = await Temperament.findOne({ where: { name: e } });
                if (foundTemperament) razaCreada.addTemperament(foundTemperament);
            });
            res.send({ message: `The dog breed ${name} was created successfully`, id: razaCreada.id });
        }         
    } catch (e) {
        if (e.original.code === '23505' && e.original.detail.includes('name')) return res.status(400).send(`The dog breed ${req.body.name} already exists`);
        res.status(400).send('Sorry, an error ocurred')
    }
})

module.exports = {
    router
}
