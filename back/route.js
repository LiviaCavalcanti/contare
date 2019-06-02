const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ExpenseController = require("./controllers/ExpenseController");
const authController = require("./controllers/authController")
const InvitationController = require("./controllers/InvitationController")

// Usuario ------------
router.get("/user", UserController.show);
router.put("/user", UserController.update);
router.get("/user/getAll",UserController.listEmails) // retorna todos os emails do sistema exceto o email do usuário corrente
router.get("/user/:userID",UserController.getObjUSER)
//---------

// DESPESAS
router.get("/user/expenses", UserController.indexExpenses);
router.get("/user/expenses/:expID", ExpenseController.show);
router.post("/user/expenses", ExpenseController.store);
router.put("/user/expenses/:expID", ExpenseController.update);
router.delete("/user/expenses/:expID", ExpenseController.delete);

// CONVITES
router.get("/user/invitations",UserController.indexInvitations) // Listar convites do cara atual
router.put("/user/invitations",InvitationController.accept) // Aceitar um convite
router.post("/user/invitations",InvitationController.refuse) // Recusar um convite

router.post("/register", authController.register);
router.post("/authenticate", authController.authenticate);

module.exports = router;