
function GameMaster() {
  var thiz = this;

  var players = {};
  var selfId = navigator.userAgent + (new Date().getTime());

  var canv3D = null;
  var canv2D = null;

  var ctx3D = null;
  var ctxUi = null;

  var start = null;

  var locMaster = null;
  var accMaster = null;
  var vibMaster = null;
  var commMaster = null;

  function imageLoadedCallback(playerId) {
    var allImgsLoaded = true;

    for(var pElem in players) {
      if(playerId == pElem) {
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
    players[selfId].pObj.setPosition(x, y);
    commMaster.sendPosition(x, y);
  }

  function collisionCallback(boolVal) {
    if(!boolVal) {
      players[selfId].pObj.drawLoadedImage(ctxUi, null);
    }
    else {
      players[selfId].pObj.drawLoadedImage(ctxUi, './gfx/burger.png');
    }
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
        //vibMaster.vibratePlayerReachedBorder();
      }
      else {
        dir = 'up';
      }
    }

    players[selfId].pObj.setDirection(dir);
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

    players[selfId] = {
      pObj: new Player(selfId, 0, imageLoadedCallback),
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

    locMaster = new GeolocationMaster(canv2D.width, canv2D.height, positionCallback, collisionCallback);
    locMaster.getInitialPosition(geoPositionError);
    locMaster.requestPositonUpdates(geoPositionError);

    accMaster = new AccelerationMaster(accelerationCallback);
    //accMaster.getAcceleration(accelerationErrorCallback);
    accMaster.requestAccelerationUpdates(accelerationErrorCallback);

    vibMaster = new VibrationMaster();

    commMaster = new CommunicationMaster(selfId,
        function(data) {
          if(data && data.pId) {
            if(data.connected) {
              if(!players[data.pId]) {
                players[data.pId] = {
                  pObj: new Player(data.pId, 1, imageLoadedCallback),
                  imageLoaded: false
                };
              }
              
              if(data.position && data.position.x && data.position.y) {
                players[data.pId].pObj.setPosition(data.position.x, data.position.y);
              }
            }
            else {
              for(var key in players) {
                if(data.pId === key) {
                  delete players[key];
                  break;
                }
              }
            }
          }
        }
    );
  }

  thiz.pause = function() {
    console.log('pause');

    if(vibMaster) {
      vibMaster.reset();
    }
  }

  thiz.resume = function() {
    console.log('resume');
  }

  init();

}
