const express = require("express");
const router = express.Router();
const models = require("../../model");
let _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../../config");

router.post("/", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    let user = new models.User();
    user.name = name;
    user.email = email;
    user.password = user.generatePasswordHash(password);
    user = await user.save();
    user = _.pick(user, models.User.returnable);
    user.token = jwt.sign(
      {
        _id: user._id,
      },
      config.secret,
      {
        expiresIn: "10d",
      }
    );
    res.status(200).json({
      data: _.pick(user, models.User.returnable),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Some error occured",
      err,
    });
  }
});

module.exports = router;
