const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Reviews = require("../models/Review");
const router = Router();

router.put(
  "/",
  [
    check("description").isLength({ min: 1 }),
    check("title").isLength({ min: 1 }),
    check("recordTitle").isLength({ min: 1 }),
    check("theme").isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "The data is incorrect",
          errors: errors.array(),
        });
      }

      const currentUser = await User.findOne({
        _id: jwt.verify(
          req.headers.authorization.split(" ")[1],
          process.env.JWT_SECRET
        ).userId,
      });
      const { title, recordTitle, tags, theme, description, imgSrc, rating } =
        req.body;
      const review = await Reviews.create({
        title,
        author: currentUser.userName,
        recordTitle,
        theme,
        tags,
        description,
        imgSrc,
        rating,
        date: new Date().toLocaleString("en-US", { timeZone: "Europe/Minsk" }),
        messages: [],
      });
      await User.updateOne(
        { _id: currentUser },
        { $push: { reviews: review } }
      );
      return res.status(200).json({ message: "Reviews was created" });
    } catch (error) {
      res.status(500).json({ message: "Create review error", error });
    }
  }
);

router.get("/user/:userId", async (req, res) => {
  try {
    const currentUser = await User.findOne({ _id: req.params.userId }).populate(
      "reviews"
    );
    const userRecords = currentUser.reviews;
    return res.json(
      userRecords.map((reviews) => ({
        id: reviews._id,
        author: reviews.author,
        title: reviews.title,
        recordTitle: reviews.recordTitle,
        theme: reviews.theme,
        tags: reviews.tags,
        description: reviews.description,
        imgSrc: reviews.imgSrc,
        rating: reviews.rating,
        date: reviews.date,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: "Get reviews error", error });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const reviews = await Reviews.find().sort({ date: -1 }).limit(10);
    console.log(reviews);
    return res.json(
      reviews.map((review) => {
        return {
          id: review._id,
          author: review.author,
          title: review.title,
          recordTitle: review.recordTitle,
          theme: review.theme,
          tags: review.tags,
          description: review.description,
          imgSrc: review.imgSrc,
          rating: review.rating,
          date: review.date,
          messages: review.messages,
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: "Get reviews error", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const review = await Reviews.findOne({ _id: id });

    return res.json({
      id: review._id,
      author: review.author,
      title: review.title,
      recordTitle: review.recordTitle,
      theme: review.theme,
      tags: review.tags,
      description: review.description,
      imgSrc: review.imgSrc,
      rating: review.rating,
      date: review.date,
      messages: review.messages,
    });
  } catch (error) {
    res.status(500).json({ message: "Get review error", error });
  }
});

router.post("/message/:id", async (req, res) => {
  try {
    const { sender, receiver, body } = req.body;
    const id = req.params.id;
    await Reviews.updateOne(
      { _id: id },
      {
        $push: {
          messages: {
            sender: sender,
            body: body,
            date: new Date().toLocaleString("en-US", {
              timeZone: "Europe/Minsk",
            }),
          },
        },
      }
    );
    return res.status(200).json();
  } catch (e) {
    res.status(500);
  }
});

router.get("/highest-rating-reviews", async (req, res) => {
  try {
    const reviews = await Reviews.find();
    return res.json(
      reviews
        .map((review) => ({
          id: review._id,
          author: reviews.author,
          title: review.title,
          recordTitle: review.recordTitle,
          theme: review.theme,
          tags: review.tags,
          description: review.description,
          imgSrc: review.imgSrc,
          rating: review.rating,
          date: review.date,
        }))
        .sort(
          (a, b) =>
            b.rating.reduce((acc, { value }) => acc + value, 0) /
              b.rating.length -
            a.rating.reduce((acc, { value }) => acc + value, 0) /
              a.rating.length
        )
        .slice(0, 10)
    );
  } catch (error) {
    res.status(500).json({ message: "Get review error", error });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { id } = req.body;
    await Reviews.deleteOne({ _id: id });
    res.status(200).json({ message: "Reviews has been deleted." });
  } catch (error) {
    res.status(500).json({ message: "Delete reviews error", error });
  }
});

module.exports = router;
