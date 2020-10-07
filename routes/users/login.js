const express = require("express");
const router = express.Router();
let models = require("../../model");
let _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../../config");

router.post("/", async (req, res) => {
  try {
    let user = await models.User.findOne({
      email: req.body.email,
    });
    if (user) {
      let isUserAuthenticated = user.validatePassword(
        req.body.password,
        user.password
      );
      if (isUserAuthenticated) {
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
          status: 200,
          data: _.pick(user, models.User.returnable),
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Password is incorrect",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "No account exist",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Some error occured",
      err,
    });
  }
});

module.exports = router;
