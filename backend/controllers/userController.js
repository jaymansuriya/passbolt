const Folder = require("../models/Folder");
const Vault = require("../models/Vault");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select({ password: 0 });
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
    const { first_name, last_name, username, password, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { first_name, last_name, username, password, email },
      { new: true, projection: { password: 0, _id: 0, __v: 0 } }
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

const updatePassword = async (req, res) => {
  try {
    const { current_password, new_password, re_new_password } = req.body;
    console.log(new_password.length + " password");
    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters" });
    }
    if (new_password !== re_new_password) {
      return res
        .status(400)
        .json({ error: "New passwords dose not match with Re-new password!" });
    }

    const user = await User.findOne({ _id: req.userId });

    // Compare the provided current_password with the stored hashed password
    const passwordMatch = await bcrypt.compare(current_password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    user.password = new_password;
    console.log("Before DB================",user.password);
    await user.save();
    console.log("After DB===============",user.password);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  updatePassword,
};
