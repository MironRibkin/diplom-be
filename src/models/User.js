const mongoose = require("mongoose");
const { Schema } = require("mongoose");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    banned: { type: Boolean, default: false },
    // avatarSrc: { type: String },
    role: { type: String },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  })
);
