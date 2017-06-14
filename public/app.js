var app = angular.module("swingSpotApp", ['ngMap', "ngGeolocation"]);
//var scope;

app.controller("MainController", ["$scope", "SpotService", "MapService",
    function ($scope, SpotService, MapService) {

        // If you need another controller and want to keep the spots in the service
        // $scope.spots = SpotService.spots;
        var self = this;
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDK2NirNh6q_wPXkoT91QDSvRJ0PbogzLE";

        $scope.addSpotMode = false;
        $scope.clickAddSpotModeButton = function () {
            $scope.addSpotMode = !$scope.addSpotMode;
            $scope.deleteSpotMode = false;
        };
        $scope.deleteSpotMode = false;
        $scope.clickDeleteSpotModeButton = function () {
            $scope.deleteSpotMode = !$scope.deleteSpotMode;
            $scope.addSpotMode = false;
        };

        MapService.getMap()
            .then(function (map) {
                this.map = map;
                // Populate the page after loading the map
                return SpotService.getSpots()
            })
            .then(function (spots) {
                $scope.spots = spots;
                MapService.setUpGeolocationMarker(spots);
            });

        $scope.mapClicked = function (e) {
            if ($scope.addSpotMode) {
                var spot = {
                    coordinate: {
                        latitude: parseFloat(e.latLng.lat().toFixed(6)),
                        longitude: parseFloat(e.latLng.lng().toFixed(6))
                    },
                    name: ""
                };

                $scope.addOrUpdateSpot(spot);
            }
        };

        $scope.markerClicked = function (e, spot) {
            // if ($scope.deleteSpotMode) {
            //     $scope.deleteSpot(spot);
            // }
            console.log(e);
            console.log(spot);
            $scope.spot = spot;
            this.map.showInfoWindow('marker-iw', spot._id);
        }

        $scope.deleteSpot = function (spot) {
            console.log("deleting spot");
            SpotService.deleteSpot(spot._id).then(function (response) {
                for (var i = 0; i < $scope.spots.length; i++) {
                    if ($scope.spots[i]._id == response.data._id) {
                        $scope.spots.splice(i, 1);
                        break;
                    }
                }
            });
        };

        $scope.addOrUpdateSpot = function (spot) {
            if (spot.hasOwnProperty('_id') && spot._id.length > 0) {
                console.log("update spot: " + JSON.stringify(spot));
                // Update the spot
                SpotService.updateSpot(spot).then(function (response) {
                    console.log("update response: " + JSON.stringify(response.data));
                    for (var i = 0; i < $scope.spots.length; i++) {
                        if ($scope.spots[i]._id == response.data._id) {
                            $scope.spots.splice(i, 1, response.data);
                            break;
                        }
                    }
                });
            } else {
                // Add the spot
                SpotService.addSpot(spot).then(function (response) {
                    $scope.spots.push(response.data);
                });
            }
        };
    }]);




