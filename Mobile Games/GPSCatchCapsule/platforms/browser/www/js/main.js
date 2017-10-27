
var gameMaster = null;

function onDeviceReady() {
  gameMaster = new GameMaster();
}

function initialze() {
  document.addEventListener('deviceready', onDeviceReady, false);
}

initialze();
