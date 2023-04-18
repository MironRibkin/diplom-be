const { Router } = require("express");
const User = require("../models/User");
const router = Router();

router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(
      users?.map((user) => ({
        id: user._id,
        userName: user.userName,
        banned: user.banned,
        email: user.email,
        avatarSrc: user.avatarSrc,
        role: user.role,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Get users error", error });
  }
});

router.delete("/users", async (req, res) => {
  try {
    const { ids } = req.body;
    await User.remove({ _id: { $in: ids } });
    res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    res.status(500).json({ message: "Delete error", error });
  }
});

router.post("/users/ban", async (req, res) => {
  try {
    const { ids } = req.body;
    await User.update({ _id: { $in: ids } }, { $set: { banned: true } });
    res.status(200).json({ message: "User was banned." });
  } catch (error) {
    res.status(500).json({ message: "Ban error", error });
  }
});

router.post("/users/unban", async (req, res) => {
  try {
    const { ids } = req.body;
    await User.update({ _id: { $in: ids } }, { $set: { banned: false } });
    res.status(200).json({ message: "User was unbanned." });
  } catch (error) {
    res.status(500).json({ message: "Unban error", error });
  }
});

router.post("/users/appoint-admin", async (req, res) => {
  try {
    const { id } = req.body;
    await User.updateOne({ _id: id }, { $set: { role: "admin" } });
    res.status(200).json({ message: "Appointed success." });
  } catch (error) {
    res.status(500).json({ message: "Appoint error", error });
  }
});

router.post("/users/remove-admin", async (req, res) => {
  try {
    const { id } = req.body;
    await User.updateOne({ _id: id }, { $set: { role: "user" } });
    res.status(200).json({ message: "Demoted success." });
  } catch (error) {
    res.status(500).json({ message: "Remove error", error });
  }
});

module.exports = router;
