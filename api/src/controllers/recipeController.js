const { Recipes, Diets } = require("../db");
require("dotenv").config();
const { API_KEY } = process.env;
const axios = require("axios");
const { Op } = require("sequelize");

const cleanningArray = (arr) => {
  if (Array.isArray(arr)) {
    return arr.map((el) => {
      const cleanningInfoApi = el.analyzedInstructions[0]?.step?.steps;
      const pasoapaso = cleanningInfoApi.map((e) => {
        return { step: e.step };
      });

      return {
        id: el.id,
        name: el.title,
        resumenDelPlato: el.summary,
        healthScore: el.healthScore,
        pasoAPaso: pasoapaso,
        image: el.image,
        diets: el.diets,
        // Diets: el.diets,
        created: false,
      };
    });
  } else if (typeof arr === "object") {
    // Si arr es un objeto, creamos un nuevo objeto con la información deseada
    const cleanAnalizedInstructions = arr.analyzedInstructions[0]?.steps;
    const pasoAPasoCLEAN = cleanAnalizedInstructions.map((e) => {
      return { step: e.step };
      // return { number: e.number, step: e.step };
    });

    return {
      id: arr.id,
      name: arr.title,
      resumenDelPlato: arr.summary,
      healthScore: arr.healthScore,
      pasoAPaso: pasoAPasoCLEAN,
      image: arr.image,
      diets: arr.diets,
      // Diets: arr.diets,
      created: false,
    };
  } else {
    return [];
  }
};
const getRecipe = async (id, source) => {
  if (source === "api") {
    const recipeApi = (
      await axios(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      )
    ).data;

    const recipeApiCleaned = cleanningArray(recipeApi);

    return recipeApiCleaned;
  } else {
    const recipe = await Recipes.findByPk(id, {
      include: {
        model: Diets,
        attributes: ["name"],
      },
    });
    if (recipe) {
      const dietsNames = recipe.Diets.map((diet) => diet.name);
      return {
        id: recipe.id,
        name: recipe.name,
        resumenDelPlato: recipe.resumenDelPlato,
        healthScore: recipe.healthScore,
        pasoAPaso: recipe.pasoAPaso,
        image: recipe.image,
        diets: dietsNames,
        created: true,
      };
    } else {
      ("No se encontro la receta buscada");
    }
  }
};

const getRecipeByName = async (name) => {
  const recipesBdd = await Recipes.findAll({
    where: {
      name: {
        [Op.iLike]: `%${name}%`,
      },
    },
    include: {
      model: Diets,
      attributes: ["name"],
    },
  });
  const recipesApi = (
    await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
    )
  ).data.results;

  const nameLower = name.toLowerCase();

  const recipesBddCLEAN = recipesBdd.map((recipe) => {
    const dietsNames = recipe.Diets.map((diet) => diet.name);
    return {
      id: recipe.id,
      name: recipe.name,
      resumenDelPlato: recipe.resumenDelPlato,
      healthScore: recipe.healthScore,
      pasoAPaso: recipe.pasoAPaso,
      image: recipe.image,
      diets: dietsNames,
      created: true,
    };
  });

  const recipesApiFiltered = recipesApi.filter((el) =>
    el.title.toLowerCase().includes(nameLower)
  );
  const recipesAPIcleaned = recipesApiFiltered.map((e) => {
    const pasoapaso = e.analyzedInstructions[0].steps.map((e) => {
      return { step: e.step };
    });
    return {
      id: e.id,
      name: e.title,
      resumenDelPlato: e.summary,
      healthScore: e.healthScore,
      pasoAPaso: pasoapaso,
      image: e.image,
      diets: e.diets,
      created: false,
    };
  });
  return [...recipesBddCLEAN, ...recipesAPIcleaned];
};

const getAllRecipes = async () => {
  const recipesFromDataBase = await Recipes.findAll({
    include: [
      {
        model: Diets,
        attributes: ["name"],
      },
    ],
  });
  const recipesBddCLEAN = recipesFromDataBase.map((recipe) => {
    const diets = recipe.Diets.map((diet) => {
      return diet.name;
    });
    return {
      id: recipe.id,
      name: recipe.name,
      healthScore: recipe.healthScore,
      image: recipe.image,
      resumenDelPlato: recipe.resumenDelPlato,
      pasoAPaso: recipe.pasoAPaso,
      diets: diets,
      created: true,
    };
  });

  const recipesFromApi = (
    await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
    )
  ).data.results;

  const recipesApiCleaned = recipesFromApi.map((recipe) => {
    const stepsARR = recipe.analyzedInstructions[0]?.steps?.map((e) => {
      return {
        step: e.step,
      };
    });

    return {
      id: recipe.id,
      name: recipe.title,
      resumenDelPlato: recipe.summary,
      healthScore: recipe.healthScore,
      pasoAPaso: stepsARR,
      image: recipe.image,
      diets: recipe.diets,
      created: false,
    };
  });

  return [...recipesBddCLEAN, ...recipesApiCleaned];
};

module.exports = { getRecipe, getRecipeByName, getAllRecipes };
