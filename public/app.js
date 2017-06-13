var app = angular.module("swingSpotApp", ['ngMap']);
//var scope;

app.controller("MainController", ["$scope", "SpotService", "MarkerService", "MapService",
    function ($scope, SpotService, MarkerService, MapService) {

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

                // Populate the page after loading the map
                return SpotService.getSpots()
            })
            .then(function (spots) {
                $scope.spots = spots;
            });
        // spots.forEach(function (spot) {
        // console.log(JSON.stringify("getSpots got spot: " + JSON.stringify(spot)));
        // MarkerService.addMarker(spot.coordinate, map, function (marker) {
        //
        //     // console.log("clicked marker " + marker);
        //     if (scope.deleteSpotMode) {
        //         // console.log("removing marker " + marker);
        //         MarkerService.removeMarker(marker);
        //         //SpotService.deleteSpot(...)
        //         //scope.deleteSpot()
        //     }
        // });
        // });
        // });

        // Do the geolocation for the blue dot
        // var GeoMarker = new GeolocationMarker(map);
        //
        // infoWindow = new google.maps.InfoWindow;
        //
        // // Try HTML5 geolocation.
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function (position) {
        //         var pos = {
        //             lat: position.coords.latitude,
        //             lng: position.coords.longitude
        //         };
        //
        //         map.setCenter(pos);
        //
        //         var closestMarker = MarkerService.getClosestMarkerTo(pos);
        //
        //         var bounds = new google.maps.LatLngBounds();
        //         //for (var i = 0; i < markerManager.markers.length; i++) {
        //         bounds.extend(closestMarker.position);
        //         bounds.extend(pos);
        //         //}
        //         map.fitBounds(bounds);
        //
        //     }, function () {
        //         handleLocationError(true, infoWindow, map.getCenter());
        //     });
        // } else {
        //     // Browser doesn't support Geolocation
        //     handleLocationError(false, infoWindow, map.getCenter());
        // }
        //
        //
        // google.maps.event.addListener(map, "click", function (e) {
        //
        //     if ($scope.addSpotMode) {
        //         console.log("clicked " + JSON.stringify(loc));
        //
        //         var spot = {
        //             coordinate: {
        //                 latitude: parseFloat(e.latLng.lat().toFixed(6)),
        //                 longitude: parseFloat(e.latLng.lng().toFixed(6))
        //             },
        //             name: ""
        //         };
        //         MarkerService.addMarker(spot.coordinate, map);
        //
        //         $scope.addOrUpdateSpot(spot);
        //     }
        // });
        // });

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
                console.log("add spot");
                // Add the spot
                SpotService.addSpot(spot).then(function (response) {
                    console.log("spot added!");
                });
            }
        }

    }
])
;


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

