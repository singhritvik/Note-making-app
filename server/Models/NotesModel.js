const mongoose = require("mongoose");

const notesSchema = new mongoose.Schema({
  userId: String,
  title: String,
  content: String,
});

module.exports = mongoose.model("Note", notesSchema);
