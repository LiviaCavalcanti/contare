
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/noderest");
mongoose.Promise = global.Promise;
var cors = require('cors')

module.exports = mongoose;

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(cors())


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

require("../controllers/authController")(app);
require("../controllers/projectController")(app);

app.listen(8080);