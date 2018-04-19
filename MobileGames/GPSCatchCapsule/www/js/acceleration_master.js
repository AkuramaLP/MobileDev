
function AccelerationMaster(accCb) {

  var thiz = this;

  var accWatchId = null;
  var gravity = [0, 0, 0];

  var alpha = 0.8;

  function successCallback(acceleration) {
    if(accCb) {
      // Isolate the force of gravity with the low-pass filter.
      gravity[0] = alpha * gravity[0] + (1 - alpha) * acceleration.x;
      gravity[1] = alpha * gravity[1] + (1 - alpha) * acceleration.y;
      gravity[2] = alpha * gravity[2] + (1 - alpha) * acceleration.z;

      // Remove the gravity contribution with the high-pass filter.
      var accX = acceleration.x - gravity[0];
      var accY = acceleration.y - gravity[1];
      var accZ = acceleration.z - gravity[2];

      accX = Math.round(accX * 4) / 4;
      accY = Math.round(accY * 4) / 4;
      accZ = Math.round(accZ * 4) / 4;

      accCb(accX, accY, accZ);
    }
  }

  thiz.getAcceleration = function(errorCb) {
    if(navigator.accelerometer) {
      navigator.accelerometer.getCurrentAcceleration(successCallback, errorCb);
    }
  }

  thiz.requestAccelerationUpdates = function(errorCb) {
    if(navigator.accelerometer) {
      accWatchId = navigator.accelerometer.watchAcceleration(successCallback,
                                                             errorCb,
                                                             { frequency: 500 });
      }
  }

  thiz.stopRequestingAccelerationUpdates = function() {
    if(accWatchId) {
      if(navigator.accelerometer) {
        navigator.accelerometer.clearWatch(accWatchId);
      }
    }
  }

}
