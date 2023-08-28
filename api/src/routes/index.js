const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const recipeRoute = require("./recipeRoute")
const dietRoute = require("./dietsRoute")


const router = Router();

// Configurar los routers

router.use("/recipes", recipeRoute);
router.use("/diets", dietRoute);

// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
