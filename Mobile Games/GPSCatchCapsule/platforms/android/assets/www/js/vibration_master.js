function VibrationMaster () {

  var thiz = this;

  var runningVibPattern = false;

  function clearVibrationPreventuion() {
    runningVibPattern = false;
  }


  this.vibratePlayerReachedBorder = function() {
    if(!runningVibPattern) {
      runningVibPattern = true;

      window.setTimeout(clearVibrationPreventuion, 2400);

      if(navigator.vibrate) {
        navigator.vibrate([1000, 200, 1000]);
      }

    }
  }

}