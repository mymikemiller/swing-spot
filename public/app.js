var app = angular.module("swingSpotApp", ['ngMap', "ngGeolocation", "ngMaterial", "ngFileUpload"]);

app.controller("MainController", ["$scope", "SpotService", "MapService", "$mdDialog", "Upload",
    function ($scope, SpotService, MapService, $mdDialog, Upload) {

        // If you need another controller and want to keep the spots in the service
        // $scope.spots = SpotService.spots;
        var self = this;
        $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDK2NirNh6q_wPXkoT91QDSvRJ0PbogzLE";

        $scope.addSpotMode = false;
        $scope.clickAddSpotModeButton = function () {
            $scope.addSpotMode = !$scope.addSpotMode;
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

                // console.log("click during add: " + e);

                $scope.showAddDialog()
                    .then(function (data) {
                        // console.log("showAddDialog's spot");
                        // console.log(data);
                        data.spot.coordinate = {
                            latitude: parseFloat(e.latLng.lat().toFixed(6)),
                            longitude: parseFloat(e.latLng.lng().toFixed(6))
                        }
                        return SpotService.addSpot(data);
                    })
                    .then(function (response) {
                        $scope.spots.push(response.data);
                    });
            }
        };

        $scope.clickEdit = function (spot) {


            var newSpot = angular.copy(spot);
            // var newSpot = {
            //     coordinate: {
            //         latitude: spot.coordinate.latitude,
            //         longitude: spot.coordinate.longitude
            //     },
            //     name: spot.name,
            //     numSwings: spot.numSwings,
            //     image: spot.image,
            //     _id: spot._id
            // };

            // console.log("newSpot:");
            // console.log(newSpot);

            $scope.showAddDialog(newSpot)
                .then(function (data) {
                    // console.log("data");
                    console.log(data.spot);
                    return SpotService.updateSpot(data);
                })
                .then(function (spot) {
                    // console.log("searching for spot to update");
                    console.log(spot);
                    for (var i = 0; i < $scope.spots.length; i++) {
                        if ($scope.spots[i]._id == spot._id) {
                            // console.log()
                            // console.log("found spot after showAddDialog");
                            // console.log("$scope.spots[" + i + "]");
                            // console.log($scope.spots[i]);
                            $scope.spots.splice(i, 1, spot);
                            $scope.markerClicked(null, spot);
                            break;
                        }
                    }
                    return spot;
                });
        };

        $scope.markerClicked = function (e, spot) {
            $scope.spot = spot;
            this.map.showInfoWindow('marker-iw', spot._id);
        };

        $scope.clickDelete = function (spot) {
            $scope.deleteSpot(spot);
        };

        $scope.showAddDialog = function (spot) {
            // console.log("Showing dialog. Spot = " + JSON.stringify(spot));
            return $mdDialog.show({
                locals: {dataToPass: spot},
                controller: DialogController,
                templateUrl: 'addDialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            }).then(function (response) {
                // console.log("response");
                // console.log(response);
                return response;
            })
        };

        function DialogController($scope, $mdDialog, dataToPass) {
            $scope.spot = dataToPass;
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel().then(function (response) {
                    // console.log("then");
                    // console.log(response);
                });
            };

            $scope.add = function (file, spot) {
                console.log("File:");
                console.log(file);
                // console.log(spot);
                $mdDialog.hide({file: file, spot: spot});
            };
        }

// Interact with the server
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
    }])
;




