const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    heightmax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    heightmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightmax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weightmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lifespanmax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lifespanmin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  
};


// {nombre, heightmax, heightmin, weightmax, weightmin, temperaments} = req.body;