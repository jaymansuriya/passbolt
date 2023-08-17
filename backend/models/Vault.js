const mongoose = require("mongoose");

const vaultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a vault name"],
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the 'Folder' model
    required: [true, "Please specify the user ID"],
  },
  fid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder', // Reference to the 'Folder' model
    required: [true, "Please specify the folder ID"],
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
});


const Vault = mongoose.model('Vault', vaultSchema);

module.exports = Vault;
