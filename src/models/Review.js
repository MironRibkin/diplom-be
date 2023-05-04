const mongoose = require("mongoose");
const atlasPlugin = require("mongoose-atlas-search");

const ReviewModel = mongoose.model(
  "Review",
  new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    recordTitle: { type: String, required: true },
    theme: { type: String, required: true },
    tags: [{ name: String }],
    description: { type: String, required: true },
    imgSrc: { type: String },
    rating: [{ value: Number, userId: String }],
    date: { type: String },
    messages: [{ sender: String, body: String, date: String }],
  })
);

atlasPlugin.initialize({
  model: ReviewModel,
  overwriteFind: true,
  searchKey: "search",
  searchFunction: (query) => {
    return {
      wildcard: {
        query: `${query}*`,
        path: [
          "title",
          "author",
          "recordTitle",
          "theme",
          "description",
          "messages.sender",
          "messages.body",
        ],
        allowAnalyzedField: true,
      },
    };
  },
});

module.exports = ReviewModel;
