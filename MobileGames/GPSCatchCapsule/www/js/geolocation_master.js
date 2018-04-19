
function GeolocationMaster(width, height, positionCb, collisionCb) {

  var thiz = this;

  var watchId = null;

  var bBox = [
    [13.41804, 52.51218],
    [13.42161, 52.51358]
  ];

  var lonMin = 0;
  var latMin = 0;
  var lonMax = 0;
  var latMax = 0;

  var latHeight = 0;
  var lonWidth = 0;

  thiz.getInitialPosition = function(errorCallback) {
    navigator.geolocation.getCurrentPosition(sCb,
                                         errorCallback,
                                         {
                                           timeout: 10000,
                                           enableHighAccuracy: false
                                         });
  }

  thiz.requestPositonUpdates = function(errorCallback) {
    watchId = navigator.geolocation.watchPosition(sCb,
                                         errorCallback,
                                         {
                                           timeout: 2000,
                                           enableHighAccuracy: true
                                         });
  }

  thiz.stopRequestingPositionUpdates = function() {
    if(watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }

  function sCb(position) {
    if(positionCb) {
      var x = ((position.coords.longitude - lonMin) / lonWidth) * width;
      var y = height - (((position.coords.latitude - latMin) / latHeight) * height);

      console.log(x + '  ' + y);
      positionCb(x, y);
    }

    if(collisionCb) {
      //Check if Player is in Collision Box to display Icon
      if((52.51304 < position.coords.latitude && position.coords.latitude < 52.51309) &&
         (13.42006 < position.coords.longitude && position.coords.longitude < 13.42010)) {
            collisionCb(true);
      }
      else {
        collisionCb(false);
      }
    }
  }

  function init() {
    lonMin = bBox[0][0];
    latMin = bBox[0][1];

    lonMax = bBox[1][0];
    latMax = bBox[1][1];

    lonWidth = lonMax - lonMin;
    latHeight = latMax - latMin;

    console.log(lonWidth + '  ' + latHeight);
  }

  init();

}
