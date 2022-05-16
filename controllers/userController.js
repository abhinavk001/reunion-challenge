const passport = require("passport");
const mongoose = require("mongoose");
const user = require("../models/user.model");
const follower = require("../models/follow.model");
const express = require("express");
const router = express.Router();

router.post(
  "/follow/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const following = await user.findById(req.params.id);
      var Follower = new follower();
      Follower.followingUserId = req.params.id;
      Follower.userId = req.user._id;
      Follower.save((err, docs) => {
        if (!err) {
          return res.json({ message: "Follow added" });
        } else {
          return res.json({ message: "Error in adding follower" });
        }
      });
    } catch (err) {
      return res.json({ message: "Bad user ID" });
    }
  }
);

router.post(
  "/unfollow/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    follower.remove(
      { userId: req.user._id, followingUserId: req.params.id },
      (err, docs) => {
        if (!err) {
          return res.json({ message: "Unfollowed" });
        } else {
          return res.json({ message: "Error in removing followin    g" });
        }
      }
    );
  }
);

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.user._id);
    let following = await follower.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
        },
      },
    ]);

    let followers = await follower.aggregate([
      { $match: { followingUserId: mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: "$followingUserId",
          count: { $sum: 1 },
        },
      },
    ]);
    current_user = await user.findById(req.user._id);
    return res.json({
      username: current_user.username,
      following: following[0].count,
      followers: followers[0].count,
    });
  }
);

module.exports = router;
