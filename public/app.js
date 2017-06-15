var app = angular.module("swingSpotApp", ['ngMap', "ngGeolocation", "ngMaterial"]);
//var scope;

app.controller("MainController", ["$scope", "SpotService", "MapService", "$mdDialog",
    function ($scope, SpotService, MapService, $mdDialog) {

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

                $scope.showAddDialog().then(function (spot) {
                    if (spot) {
                        spot.coordinate = {
                            latitude: parseFloat(e.latLng.lat().toFixed(6)),
                            longitude: parseFloat(e.latLng.lng().toFixed(6))
                        }
                        $scope.addOrUpdateSpot(spot);
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

        $scope.clickEdit = function (spot) {
            $scope.deleteSpot(spot);
        };

        $scope.showAddDialog = function (ev) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'addDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        $scope.showEditDialog = function (ev) {
            return $mdDialog.show({
                controller: DialogController,
                templateUrl: 'addDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };

            $scope.result = function (spot) {
                $mdDialog.hide(spot);
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




