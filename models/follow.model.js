const mongoose = require("mongoose");

var followSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  followingUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

mongoose.model("Follow", followSchema);
