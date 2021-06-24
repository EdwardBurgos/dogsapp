//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { Temperament, Dog, DogTemperament } = require('./src/db.js');
const axios = require('axios')

// Syncing all the models at once.
conn.sync({ force: true }).then(async () => {
  await conn.query("ALTER SEQUENCE dogs_id_seq RESTART WITH 265;")
  if (!(await Temperament.findAll()).length) { // No existe en base de datos 
    try {
      let temperaments = [];
      const response = await axios.get('https://api.thedogapi.com/v1/breeds');
      response.data.forEach((e) => {
        var temperamentsFound = e.temperament;
        if (!temperamentsFound) return;
        var newArray = temperamentsFound.split(', ');
        temperaments = [...temperaments, ...newArray];
      });
      temperaments = [...new Set(temperaments)]
      Temperament.bulkCreate(temperaments.sort().map((e) => { return { name: e } }));// Aumentarlo a la base de datos 
    } catch (e) {
      console.log(e)
    }
  }
  server.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
  //   (async () => {
  //   await sequelize.conn.sync();
  //   sequelize.query("SELECT setval('dogs_id_seq', 264);")
  // })()
});
