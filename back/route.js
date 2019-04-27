const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ExpenseController = require("./controllers/ExpenseController");
const authController = require("./controllers/authController")

// Usuario ------------
router.get("/user/:id", UserController.show);
router.post("/signup", UserController.store);
router.put("/user/:id", UserController.update);
router.delete("/user/:id", UserController.delete);
//---------

// Tarefas
router.get("/user/:userID/expenses", ExpenseController.showALL);
router.get("/user/:userID/expenses/:expID", ExpenseController.showONE);
router.post("/user/:userID/expenses", ExpenseController.store);
router.put("/user/:userID/expenses/:expID", ExpenseController.update);
router.delete("/user/:userID/expenses/:expID", ExpenseController.delete);

// Grupos
router.get("/user/:userID/groups", ExpenseController.showALL);
router.get("/user/:userID/groups/:grpID", ExpenseController.showONE);
router.post("/user/:userID/groups", ExpenseController.store);
router.put("/user/:userID/expenses/:grpID", ExpenseController.update);
router.delete("/user/:userID/expenses/:grpID", ExpenseController.delete);

router.post("/register", authController.register);
router.post("/authenticate", authController.authenticate);

module.exports = router;
