const User = require("../Models/UserModel");
const Note = require("../Models/NotesModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      const notes = await Note.find({ userId: user.id });
      //console.log(user);
      console.log(user.id);
      // console.log(notes);
      //console.log(notes._id);
      if (user) return res.json({ status: true, user: user, note: notes });
      else return res.json({ status: false });
    }
  });
};
