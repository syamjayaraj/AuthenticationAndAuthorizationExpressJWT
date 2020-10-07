const jwt = require("jsonwebtoken");
const models = require("../model");
const config = require("../config");
const _ = require("lodash");

let verifyToken = (token, next) => {
  try {
    var decoded = jwt.verify(token, config.secret);
    return { ...decoded, expired: false };
  } catch (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        var decoded = jwt.decode(token);
        if (decoded) {
          return { ...decoded, expired: true };
        } else return false;
      } else return false;
    }
  }
};

let tokenValidation = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (token) {
    req.token = token;
    try {
      const decodedToken = verifyToken(req.token, next);
      console.log(decodedToken);
      if (!decodedToken) {
        res.status(400).json({
          status: 400,
          message: "User does not have  token",
        });
      } else if (decodedToken.expired) {
        let decoded = jwt.decode(token);

        let user = await models.User.findOne({
          _id: decoded._id,
        });

        user.token = jwt.sign(
          {
            id: user._id,
          },
          config.secret,
          {
            expiresIn: "20s",
          }
        );
        req.user = { user, userType: decoded.userType };
        next();
      } else {
        let user = await models.User.findOne({
          _id: decodedToken._id,
        });
        user.token = req.token;
        req.user = _.pick(user, models.User.returnable);
        next();
      }
    } catch (err) {
      res.status(400).json({
        status: 400,
        message: "Error with your token",
      });
    }
  } else {
    res.status(400).json({
      status: 400,
      message: "User does not have  token",
    });
  }
};

module.exports.jwtauth = tokenValidation;
