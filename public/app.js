var app = angular.module("swingSpotApp", ['ngMap', "ngGeolocation", "ngMaterial", "ngFileUpload"]);
//var scope;

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

                console.log("click during add: " + e);

                $scope.showAddDialog().then(function (data) {
                    if (data.spot) {
                        data.spot.coordinate = {
                            latitude: parseFloat(e.latLng.lat().toFixed(6)),
                            longitude: parseFloat(e.latLng.lng().toFixed(6))
                        }
                        $scope.addOrUpdateSpot(data.spot);
                    }
                });
            }
        };

        $scope.markerClicked = function (e, spot) {
            $scope.spot = spot;
            this.map.showInfoWindow('marker-iw', spot._id);
        };

        $scope.clickDelete = function (spot) {
            $scope.deleteSpot(spot);
        };

        function upload(file, spot) {
            var url = "";
            var method = "";
            if (spot._id) {
                url = "/spots/" + spot._id;
                method = "PUT";
            } else {
                url = "/spots/";
                method = "POST";
            }
            Upload.upload({
                method: method,
                url: url,
                data: {file: file, info: spot}
            }).then(function (response) {
                $scope.spots.push(response.data);
            });
        }

        $scope.clickEdit = function (spot) {
            $scope.showAddDialog(spot).then(function (data) {
                if (data.file) {
                    upload(data.file, data.spot);
                } else {
                    $scope.addOrUpdateSpot(data.spot);
                }
            });
        };

        $scope.showAddDialog = function (spot) {
            console.log("Showing dialog. Spot = " + JSON.stringify(spot));
            return $mdDialog.show({
                locals: {dataToPass: spot},
                controller: DialogController,
                templateUrl: 'addDialog.tmpl.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        function DialogController($scope, $mdDialog, dataToPass) {
            $scope.spot = dataToPass;
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.result = function (file, spot) {
                $mdDialog.hide({file: file, spot: spot});
            };

            // $scope.submitImage = function (file, spot) {
            //     upload(file, spot);
            // };


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




