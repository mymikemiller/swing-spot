var app = angular.module("swingSpotApp");

app.service("MapService", ["NgMap", "$geolocation", function (NgMap, $geolocation) {
    var self = this;
    this.map;

    this.getMap = function () {
        return NgMap.getMap()
            .then(function (map) {
                self.map = map;
            });
    };

    this.setUpGeolocationMarker = function (spots) {
        var GeoMarker = new GeolocationMarker(self.map);

        var infoWindow = new google.maps.InfoWindow;

        $geolocation.getCurrentPosition().then(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            self.map.setCenter(pos);

            var closestSpot = getClosestSpotTo(spots, position.coords);

            var closestLoc = {
                lat: closestSpot.coordinate.latitude,
                lng: closestSpot.coordinate.longitude
            }

            var bounds = new google.maps.LatLngBounds();
            //for (var i = 0; i < markerManager.markers.length; i++) {
            bounds.extend(closestLoc);
            bounds.extend(pos);
            //}
            self.map.fitBounds(bounds);

        }, function () {
            handleLocationError(true, infoWindow, self.map.getCenter());
        });
    }
    ;

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    var getClosestSpotTo = function (spots, loc) {
        var closest = undefined;
        var closestDistance = undefined;
        spots.forEach(function (spot) {
            var currentDistance = getDistance(loc, spot.coordinate);
            if (closest == undefined || currentDistance < closestDistance) {
                closest = spot;
                closestDistance = currentDistance;
            }
        });
        return closest;
    };

    var getDistance = function (loc1, loc2) {
        var lat1 = loc1.latitude;
        var lat2 = loc2.latitude;
        var lng1 = loc1.longitude;
        var lng2 = loc2.longitude;
        return Math.sqrt((lat2 - lat1) * (lat2 - lat1) + (lng2 - lng1) * (lng2 - lng1));
    };


}
]);