var express = require("express");
var multer = require("multer");

var spotRoutes = express.Router();
var Spot = require("../models/spot");

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var origNameArr = file.originalname.split(".");
        console.log(origNameArr[0]);

        cb(null, origNameArr[0] + '-' + datetimestamp + '.' + origNameArr[origNameArr.length - 1]);
    }
});

var upload = multer({storage: storage}).single("file");


spotRoutes.route("/")
    .get(function (req, res) {
        console.log("get Spot");
        Spot.find(function (err, spots) {
            if (err) return res.status(500).send(err);
            return res.send(spots);
        });
    })
    .post(upload, function (req, res) {
        console.log(req.file);
        if (req.file) {
            req.body.image = req.file.filename;
        } else {
            req.body.image = "default.png";
        }
        console.log("put Spots");
        console.log(req.body);
        var spot = new Spot(req.body);
        spot.save(function (err, newSpot) {
            if (err) return res.status(500).send(err);
            return res.status(201).send(newSpot);
        });
    });

spotRoutes.route("/:id")
    .get(function (req, res) {
        Spot.findById(req.params.id, function (err, spot) {
            if (err) return res.status(500).send(err);
            return res.send(spot);
        });
    })
    .put(function (req, res) {
        if (req.file) {
            req.body.image = req.file.filename;
        }
        Spot.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, updatedSpot) {
            if (err) return res.status(500).send(err);
            console.log("sending after update " + JSON.stringify(updatedSpot));
            return res.send(updatedSpot);
        })
    })
    .delete(function (req, res) {
        Spot.findByIdAndRemove(req.params.id, function (err, removedSpot) {
            if (err) return res.status(500).send(err);
            return res.send(removedSpot);
        })
    });


spotRoutes.post("/:id/upload", upload, function (req, res) {
    console.log("in POST for upload");

});

module.exports = spotRoutes;