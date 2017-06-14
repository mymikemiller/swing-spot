var app = angular.module("swingSpotApp");

app.service("SpotService", ["$http", function ($http) {

    this.getSpots = function () {
        return $http.get("/spots").then(function (response) {
            return response.data;
        }, function (response) {
            return response;
        })
    };
    this.deleteSpot = function (id) {
        console.log("delete " + /spots/ + id);
        return $http.delete("/spots/" + id).then(function (response) {
            console.log("success");
            console.log(response);
            return response;
        }, function (response) {
            console.log("failure");
            console.log(response);
            return response;
        })
    };
    this.addSpot = function (spot) {
        console.log("adding " + JSON.stringify(spot));
        return $http.post('/spots/', spot).then(function (response) {
                console.log("success");
                console.log(response);
                return response;
            },
            function (response) {
                console.log("failure");
                console.log(response);
                return response;
            })
    };
    this.updateSpot = function (spot) {
        console.log("updating now " + JSON.stringify(spot));
        return $http.put('/spots/' + spot._id, spot).then(function (response) {
                console.log("success");
                console.log(response);
                return response;
            },
            function (response) {
                console.log("failure");
                console.log(response);
                return response;
            })
    }
}]);
