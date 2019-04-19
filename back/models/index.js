
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/noderest");
mongoose.Promise = global.Promise;

module.exports = mongoose;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require("../controllers/authController")(app);
require("../controllers/projectController")(app);

app.listen(3000);