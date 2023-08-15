const Vault = require("../models/Vault");

const getAllVaultByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const vaults = await Vault.find({ uid: userId });
    res.status(200).json(vaults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addVault = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, username, password, fid } = req.body;
    const vault = new Vault({
      name,
      uid: userId,
      fid: fid,
      username: username,
      password: password,
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
    const { name, username, password, fid } = req.body;
    const vault = await Vault.findById(vaultId);

    if (!vault) {
      return res.status(400).json({ error: "Vault not found" });
    }

    if (vault.uid.toString() !== req.userId) {
      return res.status(403).json({ error: "Permission denied" });
    }

    vault.name = name;
    vault.fid = fid;
    vault.username = username;
    vault.password = password;

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
