const Folder = require("../models/Folder");
const Vault = require("../models/Vault");
const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select({password: 0});
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, username, password, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, username, password, email },
      { new: true, projection: { password: 0, _id: 0, __v: 0 } },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    await Folder.deleteMany({ uid: userId });
    await Vault.deleteMany({ uid: userId });
    await User.deleteOne(user);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
};
