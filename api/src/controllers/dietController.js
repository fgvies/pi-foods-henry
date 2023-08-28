const axios = require("axios");
require("dotenv").config();
const { API_KEY } = process.env;
//usar la apikey del mail principal o la del mail creado si se agotan las peticiones por dia 
const { Diets } = require('../db')

const getAllDietsExists = async () => {
  const existingDiets = await Diets.findAll();

  if (existingDiets.length > 0) {
    return existingDiets.map((diet) => diet.name);
  } else {
    const dietNames = [];
    const rawInfo = (
      await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
      )
    ).data.results;

    rawInfo.forEach((elemento) => {
      elemento.diets.forEach((el) => {
        if (!dietNames.includes(el)) {
          dietNames.push(el);
        }
      });
    });

      await Diets.bulkCreate(dietNames.map((nombre) => ({ name: nombre })));

    return dietNames;
  }
};

module.exports = { getAllDietsExists };
