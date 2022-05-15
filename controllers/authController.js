if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// const mongoose = require("mongoose");
// const user = mongoose.model("User");
const user = require("../models/user.model");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");

require("../config/passport");

genToken = (user) => {
  return jwt.sign(
    {
      user: {
        _id: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
      },
    },
    process.env.JWT_SECRET
  );
};

router.post("/login", async function (req, res, next) {
  passport.authenticate("local", async (err, user, info) => {
    console.log();
    if (err || !user) {
      return res.status(400).json({
        message: "Something is not right",
        user: user,
        err: err,
      });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) {
        res.send(next(err));
      } // generate a signed son web token with the contents of user object and return it in the response
      const token = genToken(user);
      return res.json({ token });
    });
  })(req, res, next);
});
module.exports = router;
