const { Router } = require("express");

const {
  getRecipeByIdHandler,
  getAllRecipeHandler,
  postRecipeHandler,
} = require("../handlers/recipeHandlers");

const recipeRouter = Router();

recipeRouter.get("/:id", getRecipeByIdHandler);
recipeRouter.get("/", getAllRecipeHandler);
recipeRouter.post("/", postRecipeHandler);
recipeRouter.delete("/", deleteRecipe)

module.exports = recipeRouter;
