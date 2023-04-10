const { Schema, model } = require("mongoose");

module.exports = model(
  "Message",
  new Schema({
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: String, required: true },
  })
);
