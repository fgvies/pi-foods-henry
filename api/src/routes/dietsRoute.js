const {Router} = require("express");
const handleDiets = require("../handlers/dietsHandler");

const dietRoute = Router();

dietRoute.get("/", handleDiets);

module.exports =  dietRoute;