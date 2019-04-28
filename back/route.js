const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ExpenseController = require("./controllers/ExpenseController");
const authController = require("./controllers/authController")

// Usuario ------------
router.get("/user", UserController.show);
router.put("/user", UserController.update);
//---------

// Tarefas
router.get("/user/:userID/expenses", ExpenseController.index);
router.get("/user/:userID/expenses/:expID", ExpenseController.show);
router.post("/user/:userID/expenses", ExpenseController.store);
router.put("/user/:userID/expenses/:expID", ExpenseController.update);
router.delete("/user/:userID/expenses/:expID", ExpenseController.delete);

router.post("/register", authController.register);
router.post("/authenticate", authController.authenticate);

module.exports = router;
