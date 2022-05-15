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
  postTime: {
    type: Date,
    required: true,
  },
  postLike: {
    type: Number,
    default: 0,
  },
});

mongoose.model("Post", postSchema);
