const { DataTypes } = require('sequelize');
const countries = require('../extras/countries')
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('like', {
    });
};

