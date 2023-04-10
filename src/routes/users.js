const { Router } = require("express");
const userModel = require("../models/user");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await userModel.find(); //возвращает всех юзеров что есть в базе
    res.status(200).json(
      users.map((user) => ({
        username: user.username,
      }))
    );
  } catch (e) {
    res.status(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name } = req.body;
    const currentUser = await userModel.find().where("username").equals(name);

    if (currentUser[0] !== undefined) {
      return res.status(200).json({ message: `${currentUser[0].username}` });
    } else {
      const newUser = new userModel({ username: name });
      await newUser.save();
      console.log(newUser);
      res.status(200).json({ message: `${newUser.username}` });
    }
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
