var mongoose = require("mongoose");

var spotSchema = new mongoose.Schema({
    coordinate: {
        latitude: Number,
        longitude: Number
    },
    name: String
});

module.exports = mongoose.model("Spot", spotSchema);