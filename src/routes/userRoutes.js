const express = require("express");
const { AuthController } = require("../controllers/auth.controller");
const { UserController } = require("../controllers/user.controller");
const AuthMiddlewares = require("../middlewares/auth.middleware");


const router = express.Router();

//router.route()

router.post("/signup", AuthController.RegisterUser);

router.post("/login", AuthController.logInUser);

router.post("/logout", AuthController.logOutUser)

router.patch("/:id", AuthMiddlewares.checkAuth, UserController.UpdateUser)
        .delete("/:id",AuthMiddlewares.checkAuth, UserController.DeleteUser)

userRoutes = router
module.exports = userRoutes;
