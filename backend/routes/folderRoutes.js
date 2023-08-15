const { Router } = require("express");
const folderController = require("../controllers/folderController");

const router = Router();

router.get("/", folderController.getAllFoldersByUser);
router.post("/add", folderController.addFolder);
router.put("/:folderId", folderController.updateFolder);
router.delete("/:folderId", folderController.deleteFolder);

module.exports = router;
