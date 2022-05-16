const passport = require("passport");
const mongoose = require("mongoose");
const user = require("../models/user.model");
const post = require("../models/post.model");
const comment = require("../models/comment.schema");
const express = require("express");
const router = express.Router();

router.post(
  "/post",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var Post = new post();
    Post.postTitle = req.body.title;
    Post.postDescription = req.body.description;
    Post.postTime = new Date().getTime();
    Post.userId = req.user._id;
    Post.save((err, docs) => {
      if (!err) {
        return res.json({ message: "Post added" });
      } else {
        return res.json({ message: "Error in adding Post " + err });
      }
    });
  }
);

router.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    post.findByIdAndRemove(req.params.id, (err, docs) => {
      if (!err) {
        return res.json({ message: "Post deleted successfully" });
      } else {
        return res.json({ message: "Error in deleting Post " + err });
      }
    });
  }
);

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    post.findById(req.params.id).then((docs) => {
      if (!docs) {
        return res.json({ message: "Error in retrieving post" });
      } else {
        const likes = docs.postLike;
        post.findByIdAndUpdate(
          req.params.id,
          { postLike: parseInt(likes) + 1 },
          (err, docs) => {
            if (!err) {
              return res.json({ message: "Like added" });
            } else {
              return res.json({ message: "Error in updating post" + err });
            }
          }
        );
      }
    });
  }
);

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    post.findById(req.params.id).then((docs) => {
      if (!docs) {
        return res.json({ message: "Error in retrieving post" });
      } else {
        const likes = docs.postLike;
        post.findByIdAndUpdate(
          req.params.id,
          { postLike: parseInt(likes) - 1 },
          (err, docs) => {
            if (!err) {
              return res.json({ message: "Unliked" });
            } else {
              return res.json({ message: "Error in updating post" + err });
            }
          }
        );
      }
    });
  }
);

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var Comment = new comment();
    Comment.postId = req.params.id;
    Comment.comment = req.body.comment;
    Comment.save((err, docs) => {
      if (!err) {
        return res.json({ CommentId: docs._id });
      } else {
        return res.json({ message: "Error in adding Comment" });
      }
    });
  }
);

router.get("/post/:id", (req, res) => {
  post.findById(req.params.id).then(async (docs) => {
    if (!docs) {
      return res.json({ message: "Error retrieving post" });
    } else {
      comments = await comment.find({ postId: req.params.id });
      return res.json({
        id: docs._id,
        title: docs.postTitle,
        desc: docs.postDescription,
        created_at: docs.postTime,
        comment: comments,
        likes: docs.postLike,
      });
    }
  });
});

router.get(
  "/all_post",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    post
      .find({ userId: req.user._id }, async (err, docs) => {
        if (err) {
          return res.json({ message: "Error retrieving post" });
        } else {
          var response = [];
          //   docs.forEach((element) => {
          //     comment.find({ postId: element._id }, (err, docs) => {
          //       element.comments = docs;
          //       response.push(element);
          //     });
          //   });
          for (element of docs) {
            comments = await comment.find({ postId: element._id });
            element.comments = comments;
            response.push(element);
          }
          response.sort((a, b) => {
            let da = new Date(a.postTime),
              db = new Date(b.postTime);
            return da - db;
          });
          return res.json(response);
        }
      })
      .lean();
  }
);
module.exports = router;
