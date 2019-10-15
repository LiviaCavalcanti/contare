const express = require("express");
const router = express.Router();
const UserController = require("./controllers/UserController");
const ExpenseController = require("./controllers/ExpenseController");
const authController = require("./controllers/authController")
const InvitationController = require("./controllers/InvitationController")
const incomeController = require("./controllers/incomeController")
const authMiddleware = require("./middleware/auth")

router.use(authMiddleware);

// Usuario ------------
router.get("/user", UserController.show);
router.post("/user/edit", UserController.update);
router.get("/user/getAll",UserController.listEmails) // retorna todos os emails do sistema exceto o email do usuário corrente

//---------

// DESPESAS
router.get("/user/expenses", UserController.indexExpenses);
router.get("/user/expenses/:expID", ExpenseController.show);
router.post("/user/expenses", ExpenseController.store);
router.put("/user/expenses/:expID", ExpenseController.update);
router.delete("/user/expenses/:expID", ExpenseController.delete);

// RECEITAS
router.get("/user/incomes", incomeController.getAll);
router.get("/user/incomes/:incomeId", incomeController.get);
router.post("/user/incomes", incomeController.create);
router.put("/user/incomes/:incomeId", incomeController.update);
router.delete("/user/incomes/:incomeId", incomeController.delete);

// CONVITES
router.get("/user/invitations",UserController.indexInvitations) // Listar convites do cara atual
router.put("/user/invitations",InvitationController.accept) // Aceitar um convite
router.post("/user/invitations",InvitationController.refuse) // Recusar um convite

// AMIGOS
router.get("/user/friends", UserController.getFriends);
router.post("/user/friends", UserController.addNewFriendship);
router.delete("/user/friends",UserController.deleteFriendship);

router.post("/register", authController.register);
router.post("/authenticate", authController.authenticate);

router.get("/user/:userID",UserController.getObjUSER)

module.exports = router;
