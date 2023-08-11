const Folder = require("../models/Folder");

const getAllFoldersByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const folders = await Folder.find({ uid: userId });
    res.status(200).json(folders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addFolder = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;
    const folder = new Folder({
      name,
      uid: userId,
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Folder already exists" });
    }
    res.status(500).json({ error: error.message });
  }
};

const updateFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const { name } = req.body;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (folder.uid.toString() !== req.userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    folder.name = name;
    const updatedFolder = await folder.save();
    res.status(200).json(updatedFolder);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (folder.uid.toString() !== req.userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    await Folder.findByIdAndDelete(folderId);
    res.status(204).end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFoldersByUser,
  addFolder,
  updateFolder,
  deleteFolder,
};
