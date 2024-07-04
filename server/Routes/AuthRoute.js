const {
  Signup,
  Login,
  addNote,
  deleteNote,
} = require("../Controllers/AuthController");
const { userVerification } = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/addNote", addNote);
router.post("/deleteNote", deleteNote);

module.exports = router;
