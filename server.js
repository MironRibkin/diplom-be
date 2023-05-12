require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

// errors
app.use(cors());
app.use(express.json({ extended: true }));
// rout
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/admin", require("./src/routes/admin"));
app.use("/api/reviews", require("./src/routes/reviews"));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
    });
    app.listen(process.env.PORT, () =>
      console.log(`Started on port ${process.env.PORT}...`)
    );
  } catch (e) {
    console.log("Server error", e.message);
    process.exit(1);
  }
};
start();
