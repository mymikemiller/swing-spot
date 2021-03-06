var express = require("express");
var mongoose = require("mongoose");
var morgan = require("morgan");
var bodyParser = require("body-parser");
//var uuid = require("uuid");
var app = express();
var path = require('path');
var port = process.env.PORT || 7700;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    console.log("First req.body:");
    console.log(req.body);
    next();
});


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/spots", function (err) {
    if (err) {
        throw err;
    }
    console.log('connect to database');
});

app.use(bodyParser.json());

app.use("/spots", require("./routes/spotRoutes.js"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.listen(port, function () {
    console.log("Listening on port " + port);
})
