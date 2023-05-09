const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = Router();

router.post(
  "/registration",
  [check("email").isEmail(), check("password").isLength({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "The data is not correct.",
          errors: errors.array(),
        });
      }

      const { email, password, userName, avatarSrc } = req.body;

      const isUserAlreadyExists = !!(await User.findOne(
        { email } && { userName }
      ));

      if (isUserAlreadyExists) {
        return res.status(400).json({
          message: "This email already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        userName,
        avatarSrc,
        role: "user",
        password: passwordHash,
      });
      await user.save();
      return res.status(200).json({ message: "User was created." });
    } catch (e) {
      res.status(500).json({ message: "Error creating user." });
    }
  }
);

router.post(
  "/login",
  [check("email").isEmail().normalizeEmail(), check("password").exists()],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(401).json({
          errors: errors.array(),
          message: "Wrong data.",
        });
      }
      const { email, password } = req.body;
      const currentUser = await User.findOne({ email });
      if (!currentUser) {
        return res.status(401).json({
          message: "Not registered user.",
        });
      }

      if (currentUser.status) {
        return res.status(401).json({ message: "Нou've been blocked." });
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        currentUser.password
      );

      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Wrong password",
        });
      }
      console.log(currentUser.id);
      console.log(password);

      const token = jwt.sign(
        { userId: currentUser.id, role: currentUser.role },
        process.env.JWT_SECRET
      );
      console.log(process.env.JWT_SECRET);
      currentUser.lastVisit = Date.now();
      console.log(currentUser.id);

      console.log(token);

      await currentUser.save();
      console.log(currentUser);
      res.json({ token, record: { ...currentUser, id: currentUser._id } });
    } catch (e) {
      res.status(401).json({ message: "Error login user" });
    }
  }
);

router.get("/user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not logged in, please login." });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findOne({ _id: user.userId });

    if (currentUser.banned) {
      return res.status(401).json({ message: "You just got banned." });
    }

    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "Your account has just been deleted." });
    }
    return res.json({
      id: currentUser._id,
      userName: currentUser.userName,
      banned: currentUser.banned,
      email: currentUser.email,
      avatarSrc: currentUser.avatarSrc,
      role: currentUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Refresh error", error });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.params.id });

    if (!currentUser) {
      return res
        .status(401)
        .json({ message: "This account has just been deleted." });
    }
    return res.json({
      id: currentUser._id,
      userName: currentUser.userName,
      banned: currentUser.banned,
      email: currentUser.email,
      avatarSrc: currentUser.avatarSrc,
      role: currentUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Refresh error", error });
  }
});

module.exports = router;
