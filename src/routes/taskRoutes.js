const express = require("express");
const { TaskController } = require("../controllers/task.controller");

const router = express.Router();

//router.route()

router.post("/", TaskController.createTask)
        .get("/userId/:id", TaskController.getTasksByUserId)
        .get("/setorId/:id", TaskController.getTasksBySetorId)

taskRoutes = router
module.exports = taskRoutes;