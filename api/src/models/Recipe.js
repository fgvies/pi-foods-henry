const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Recipes",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      resumenDelPlato: {
        type: DataTypes.TEXT,
        allowNull: false,
        charset: 'utf8mb4', // Asegúrate de utilizar el conjunto de caracteres correcto
        collate: 'utf8mb4_unicode_ci'
      },
      healthScore: {
        type: DataTypes.INTEGER,
      },
      pasoAPaso: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      created: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    { timestamps: false }
  );
};
