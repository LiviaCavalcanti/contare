const express = require("express")
const routes = express.Router()

const UserController = require("./controllers/UserController")

routes.post("/singup", UserController.store)
router.get("/user/:id", UserController.show)
router.put("user/:id", UserController.update)

module.exports = routes