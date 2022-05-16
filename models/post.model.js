const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  postTitle: {
    type: String,
    required: true,
  },
  postDescription: {
    type: String,
    required: true,
  },
  postTime: {
    type: Date,
    required: true,
  },
  postLike: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Post", postSchema);
