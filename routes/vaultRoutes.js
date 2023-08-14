const { Router } = require("express");
const vaultController = require("../controllers/vaultController");

const router = Router();

router.get("/", vaultController.getAllVaultByUser);
router.post("/add", vaultController.addVault);
router.put("/:vaultId", vaultController.updateVault);
router.delete("/:vaultId", vaultController.deleteVault);

module.exports = router;


