const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Review",
  new mongoose.Schema({
    title: { type: String, required: true },
    recordTitle: { type: String, required: true },
    theme: { type: String, required: true },
    tags: [{ name: String }],
    description: { type: String, required: true },
    imgSrc: { type: String },
    rating: [{ value: Number, userId: String }],
    date: { type: String },
    messages: [
      { sender: String, receiver: String, body: String, date: String },
    ],
  })
);
