
function GameMaster() {
  var thiz = this;

  var players = {};

  var canv3D = null;
  var canv2D = null;

  var ctx3D = null;
  var ctxUi = null;

  var start = null;


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

      console.log(deltaT);

      if(ctxUi) {
        ctxUi.clearRect(0, 0, ctxUi.canvas.width, ctxUi.canvas.height);

        for(var player in players) {
          players[player].pObj.draw(ctxUi, deltaT);
        }
      }

      start = timestamp;
      window.requestAnimationFrame(draw);
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
  }

  init();

}
