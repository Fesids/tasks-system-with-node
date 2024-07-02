const express = require("express");
const { SetorController } = require("../controllers/setor.controller");

const router = express.Router();

//router.route()

router.post("/", SetorController.createSetor);

setorRoutes = router
module.exports = setorRoutes;