const Vault = require("../models/Vault");
const bcrypt = require("bcrypt");

const getAllVaultByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const vaults = await Vault.find({ uid: userId });
    res.status(200).json(vaults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllVaultsInFolder = async (req, res) => {
  try {
    const userId = req.userId;
    const folderId = req.params.folderId;
    const vaults = await Vault.find({ uid: userId, fid: folderId });
    res.status(200).json(vaults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addVault = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, username, password, folderId } = req.body;
    const salt = await bcrypt.genSalt();
    const encryptedUsername = await bcrypt.hash(username, salt);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const vault = new Vault({
      name,
      uid: userId,
      fid: folderId,
      username: encryptedUsername,
      password: encryptedPassword,
    });

    await vault.save();
    res.status(201).json(vault);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVault = async (req, res) => {
  try {
    const vaultId = req.params.vaultId;
    const { name, username, password, folderId } = req.body;
    const vault = await Vault.findById(vaultId);

    if (!vault) {
      return res.status(400).json({ error: "Vault not found" });
    }

    if (vault.uid.toString() !== req.userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    const salt = await bcrypt.genSalt();
    const encryptedUsername = await bcrypt.hash(username, salt);
    const encryptedPassword = await bcrypt.hash(password, salt);

    vault.name = name;
    vault.fid = folderId;
    vault.username = encryptedUsername;
    vault.password = encryptedPassword;

    const updatedVault = await vault.save();
    res.status(200).json(updatedVault);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Vault not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

const deleteVault = async (req, res) => {
  try {
    const vaultId = req.params.vaultId;
    const vault = await Vault.findById(vaultId);

    if (!vault) {
      return res.status(400).json({ error: "Vault not found" });
    }

    if (vault.uid.toString() !== req.userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    await Vault.findByIdAndDelete(vaultId);
    res.status(204).end();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Vault not found" });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllVaultByUser,
  addVault,
  updateVault,
  deleteVault,
};
