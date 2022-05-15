const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

mongoose.model("Comment", commentSchema);
