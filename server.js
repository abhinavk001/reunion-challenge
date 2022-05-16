if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
require("./models/db.js");
const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");

const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

var app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api", authController);
app.use("/api", userController);
app.use("/api", postController);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
