const { Router } = require("express");
const userController = require("../controllers/userController");

const router = Router();


router.get("/", userController.getUser);
router.put("/", userController.updateUser);
router.delete("/", userController.deleteUser);

module.exports = router;
