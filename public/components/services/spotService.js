var app = angular.module("swingSpotApp");

app.service("SpotService", ["$http", "Upload", function ($http, Upload) {

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

    this.addSpot = function (data) {
        return Upload.upload({
            url: "/spots",
            data: data
        });
        //     return $http.post('/spots/', spot).then(function (response) {
        //             return response;
        //         },
        //         function (response) {
        //             console.log("failure");
        //             console.log(response);
        //             return response;
        //         })
    };
    this.updateSpot = function (data) {
        console.log(data);
        return Upload.upload({
            method: "PUT",
            url: "/spots/" + data.spot._id,
            data: data
        });
        // console.log("updating now " + JSON.stringify(spot));
        // return $http.put('/spots/' + spot._id, spot).then(function (response) {
        //         console.log("success");
        //         console.log(response);
        //         return response;
        //     },
        //     function (response) {
        //         console.log("failure");
        //         console.log(response);
        //         return response;
        //     })
    }
}]);
