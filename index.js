const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const users = require("./routes/users");

app.use(logger("dev"));

let dbUrl = "mongodb://localhost:27017/simplebackend";
var options = {
  keepAlive: 1,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, options, (err) => {
  if (err) console.log(err);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/users", users);
app.listen(port, function () {
  console.log("Runnning on " + port);
});
module.exports = app;
