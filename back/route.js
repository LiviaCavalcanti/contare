const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ExpenseController = require("./controllers/ExpenseController");
const authController = require("./controllers/authController")

// Usuario ------------
router.get("/user", UserController.show);
router.put("/user", UserController.update);
//---------

// DESPESAS
router.get("/user/expenses", UserController.indexExpenses);
router.get("/user/expenses/:expID", ExpenseController.show);
router.post("/user/expenses", ExpenseController.store);
router.put("/user/expenses/:expID", ExpenseController.update);
router.delete("/user/expenses/:expID", ExpenseController.delete);

router.post("/register", authController.register);
router.post("/authenticate", authController.authenticate);

module.exports = router;