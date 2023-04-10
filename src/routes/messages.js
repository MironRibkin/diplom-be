const { Router } = require("express");
const messageModel = require("../models/message");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const { username } = req.query; // query параметр
    const messages = await messageModel.find(); // достать все сообщения
    const reversedMassages = await messages.reverse(); //перевернуть сообщения
    res.status(200).json(
      reversedMassages
        ?.filter((message) => message.receiver === username)
        ?.map((message) => ({
          id: message._id,
          sender: message.sender,
          receiver: message.receiver,
          title: message.title,
          body: message.body,
          date: message.date,
        }))
    );
  } catch (e) {
    res.status(500);
  }
});

router.post("/send", async (req, res) => {
  try {
    const { sender, receiver, title, body } = req.body;
    const newMessage = new messageModel({
      sender: sender,
      receiver: receiver,
      title: title,
      body: body,
      date: new Date().toLocaleString("en-US", { timeZone: "Europe/Minsk" }),
    });
    console.log(newMessage);
    await newMessage.save();
    return res.status(200).json();
  } catch (e) {
    res.status(500);
  }
});

module.exports = router;
