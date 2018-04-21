
function EnergyMaster(energyCb) {

  var thiz = this;

  window.addEventListener("batterystatus", onBatteryStatus, false);

  function onBatteryStatus(status) {
      if(energyCb) {
        if(status.isPlugged) {
          energyCb(true);
          return;
        }
        else {
          if(status.level >= 55) {
            energyCb(true);
            return;
          }
        }

        energyCb(false);
      }
  }

}
