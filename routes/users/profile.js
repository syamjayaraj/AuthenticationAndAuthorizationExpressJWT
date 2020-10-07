const express = require("express");
const router = express.Router();
const models = require("../../model");
const { jwtauth } = require("../../lib/jwtlib");
let _ = require("lodash");

router.get("/public/:userId", async (req, res) => {
  try {
    let user = await models.User.findOne({
      _id: req.params.userId,
    });
    res.status(200).json({
      data: _.pick(user, models.User.publicReturnable),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Some error occured",
      err,
    });
  }
});

router.get("/", [jwtauth], async (req, res) => {
  try {
    let user = await models.User.findOne({
      _id: req.user._id,
    });
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

router.put("/", [jwtauth], async (req, res) => {
  try {
    let user = await models.User.findOne({
      _id: req.user._id,
    });
    user = _.merge(user, _.pick(req.body, models.User.fillable));
    user = await user.save();
    user = _.pick(user, models.User.returnable);
    res.status(200).json({
      data: _.pick(user, models.User.returnable),
    });
  } catch (err) {
    res.status(400).json({
      message: "Some error occured",
      err,
    });
  }
});

module.exports = router;
