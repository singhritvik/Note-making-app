const User = require("../Models/UserModel");
const Note = require("../Models/NotesModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({
      email,
      password,
      username,
      createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    const token = createSecretToken(user._id);
    console.log(user);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.addNote = async (req, res) => {
  //const token = req.cookies.token;
  //console.log(req.body);
  const { userID, title, content } = req.body;
  //console.log(userID, title, content);
  try {
    const newNote = new Note({ userId: userID, title, content });
    //console.log(newNote);
    await newNote.save();
    const updatedNotes = await Note.find({ userId: userID });
    //console.log(updatedNotes);
    res.send(updatedNotes);
  } catch (error) {
    console.error("Error adding note:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports.deleteNote = async (req, res) => {
  const { id, userID } = req.body;
  try {
    await Note.findByIdAndRemove(id);
    console.log("Item removed successfully");
    const updatedNotes = await Note.find({ userId: userID });
    res.send(updatedNotes);
  } catch (error) {
    console.error("Error serverside deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
};
