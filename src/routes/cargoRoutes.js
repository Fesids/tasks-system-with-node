const { CargoController } = require("../controllers/cargo.controller");
const express = require("express");

const router = express.Router();

//router.route()

router.post("/", CargoController.createCargo);

cargoRoutes = router
module.exports = cargoRoutes;