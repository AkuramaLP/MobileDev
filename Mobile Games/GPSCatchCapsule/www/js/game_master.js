
function GameMaster() {
  var thiz = this;

  var players = {};

  var canv3D = null;
  var canv2D = null;

  var ctx3D = null;
  var ctxUi = null;

  var start = null;

  var locMaster = null;
  var accMaster = null;
  var vibMaster = null;

  function imageLoadedCallback(playerId) {
    var allImgsLoaded = true;

    for(var pElem in players) {
      if(playerId == pElem) {
        console.log('player loaded: ' + playerId);
        players[pElem].imageLoaded = true;
      }
      else if(!players[pElem].imageLoaded) {
        allImgsLoaded = false;
      }
    }

    if(allImgsLoaded) {
      draw();
    }
  }

  function draw(timestamp) {
    var deltaT = timestamp - start;

    if(ctxUi) {
      ctxUi.clearRect(0, 0, ctxUi.canvas.width, ctxUi.canvas.height);

      for(var player in players) {
        players[player].pObj.draw(ctxUi, deltaT);
      }
    }

    start = timestamp;
    requestAnimationFrame(draw);
  }

  function geoPositionError(error) {
    console.log(error);
  }

  function positionCallback(x, y) {
    players[0].pObj.setPosition(x, y);
  }

  function accelerationCallback(accX, accY, accZ) {
    if (accY * accY < accX * accX) {
      if (accX < 0) {
        dir = 'right';
      }
      else {
        dir = 'left';
      }
    }
    else {
      if (accY > 0) {
        dir = 'down';
        vibMaster.vibratePlayerReachedBorder();
      }
      else {
        dir = 'up';
      }
    }

    players[0].pObj.setDirection(dir);
  }

  function accelerationErrorCallback() {
    console.log('acceleration could not be determined!');
  }

  function init() {
    canv3D = document.getElementById('gameCanvas3D');
    canv3D.width = window.innerWidth;
    canv3D.height = window.innerHeight;

    canv2D = document.getElementById('gameCanvas2D');
    canv2D.width = window.innerWidth;
    canv2D.height = window.innerHeight;

    players[0] = {
      pObj: new Player(0, 0, imageLoadedCallback),
      imageLoaded: false
    };
    /*
    players[1] = {
      pObj: new Player(1, 1, imageLoadedCallback),
      imageLoaded: false
    };
    */

    if(null !== canv3D) {
      ctx3D = canv3D.getContext('webgl');
      console.log(ctx3D);
    }

    if(null !== canv2D) {
      ctxUi = canv2D.getContext('2d');
    }

    var tmpDate = new Date();
    start = tmpDate.getTime();
    requestAnimationFrame(draw);

    locMaster = new GeolocationMaster(canv2D.width, canv2D.height, positionCallback);
    locMaster.getInitialPosition(geoPositionError);
    locMaster.requestPositonUpdates(geoPositionError);

    accMaster = new AccelerationMaster(accelerationCallback);
    //accMaster.getAcceleration(accelerationErrorCallback);
    accMaster.requestAccelerationUpdates(accelerationErrorCallback);

    vibMaster = new VibrationMaster();

  }

  thiz.pause = function() {
    if(vibMaster) {
      vibMaster.reset();
    }
  }

  thiz.resume = function() {

  }

  init();

}
