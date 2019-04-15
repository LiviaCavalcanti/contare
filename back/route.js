const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ExpenseController = require("./controllers/ExpenseController");

router.post("/signup", UserController.store);
router.get("/user/:id", UserController.show);
router.put("/user/:id", UserController.update);
router.get("/user/:id/expenses", UserController.showExpenses);

router.put("/user/:id/create_expense", ExpenseController.store);

module.exports = router;
