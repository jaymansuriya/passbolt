const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please enter a folder name"],
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the 'User' model
      required: [true, "Please specify the user ID"],
    },
  });
  
  // for unique folder with the combination of name and userid
  folderSchema.index({ name: 1, uid: 1 }, { unique: true });
  
  const Folder = mongoose.model('Folder', folderSchema);
  
  module.exports = Folder;