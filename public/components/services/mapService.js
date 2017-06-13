var app = angular.module("swingSpotApp");

app.service("MapService", ["NgMap", function (NgMap) {
    var self = this;
    this.map;

    this.getMap = function() {
        return NgMap.getMap()
            .then(function (map) {
                self.map = map;
            });
    }
}]);