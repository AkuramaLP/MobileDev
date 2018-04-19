
var gameMaster = null;

function onDeviceReady() {
  gameMaster = new GameMaster();
}

function onPause() {
  gameMaster.pause();
}

function onResume() {
  gameMaster.resume();
}

function initialze() {
  document.addEventListener('deviceready', onDeviceReady, false);
  document.addEventListener('pause', onPause, false)
  document.addEventListener('resume', onResume, false)
}

initialze();
