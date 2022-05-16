// const mongoose = require("mongoose");
// const user = mongoose.model("User");
const user = require("../models/user.model");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

const jwtSecret = require("./jwt");

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      user.findOne({ email: email }, function (err, user) {
        if (!user) return done(null, false, { message: "Incorrect email" });

        bcrypt.compare(password, user.password, function (err, res) {
          if (err) return done(err);
          if (res === false)
            return done(null, false, { message: "Incorrect password" });

          return done(null, user, { message: "logged in" });
        });
      });
    }
  )
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret.secret,
};

passport.use(
  "jwt",
  new JWTstrategy(opts, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (err) {
      done(err);
    }
  })
);
