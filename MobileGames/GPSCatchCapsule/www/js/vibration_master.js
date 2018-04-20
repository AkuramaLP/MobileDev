
function VibrationMaster() {

  var thiz = this;

  thiz.vibratePlayerReachedBorder = function() {
      if(navigator.vibrate) {
        navigator.vibrate([30000]);
      }
  }

  thiz.reset = function() {
    if(navigator.vibrate) {
      navigator.vibrate(0);
    }
  }

}
