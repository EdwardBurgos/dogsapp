const { Router } = require('express');
const axios = require('axios').default;
const { Temperament, Dog, DogTemperament } = require('../db.js');
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
            responseOwn = responseOwn.map(e => { return {
                id: e.dataValues.id,
                image: 'https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg',
                name: e.dataValues.name,
                temperament: e.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g,', ') ,
            }})
        }
        responseNotOwn = responseNotOwn.data.map((e) => { return { id: e.id, image: e.image.url, name: e.name, temperament: e.temperament}})
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
            return res.json(response.map(e => { return {
                id: e.dataValues.id,
                image: 'https://hips.hearstapps.com/wdy.h-cdn.co/assets/17/39/1506709524-cola-0247.jpg',
                name: e.dataValues.name,
                temperament: e.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g,', ') ,
            }}))
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
                temperament: responseDogs.dataValues.temperaments.map(e => e.dataValues.name).toString().replace(/,/g,', ') ,
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