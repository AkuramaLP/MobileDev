
function Player(id, type, callbackFunc) {

  var thiz = this;
  var playerImg = new Image(576, 256);

  var lookDirection = 'left';
  var stepCounter = 0;

  var spritePos = {
    'up': {
      'stepcount': 9,
      'steps': [
        [0, 0],
        [64, 0],
        [128, 0],
        [192, 0],
        [256, 0],
        [320, 0],
        [384, 0],
        [448, 0],
        [512, 0]
      ]
    },
    'left': {
      'stepcount': 9,
      'steps': [
        [0, 64],
        [64, 64],
        [128, 64],
        [192, 64],
        [256, 64],
        [320, 64],
        [384, 64],
        [448, 64],
        [512, 64]
      ]
    },
    'down': {
      'stepcount': 9,
      'steps': [
        [0, 128],
        [64, 128],
        [128, 128],
        [192, 128],
        [256, 128],
        [320, 128],
        [384, 128],
        [448, 128],
        [512, 128]
      ]
    },
    'right': {
      'stepcount': 9,
      'steps': [
        [0, 192],
        [64, 192],
        [128, 192],
        [192, 192],
        [256, 192],
        [320, 192],
        [384, 192],
        [448, 192],
        [512, 192]
      ]
    }
  };

  var spriteWidth = 64;
  var spriteHeight = 64;

  var x = 0;
  var y = 0;

  thiz.draw = function(ctx, deltaTime) {
    if(ctx) {

      var sPos = spritePos[lookDirection].steps[stepCounter % spritePos[lookDirection].stepcount];

      ctx.drawImage(playerImg, sPos[0], sPos[1], spriteWidth, spriteHeight, x, y, spriteWidth, spriteHeight);


      if(deltaTime > 16)
      {
        stepCounter++;
      }

    }
  };

  function init() {
    playerImg.onload = function() {
      if(callbackFunc) {
        callbackFunc(id);
      }
    }

    switch (type) {
      case 1:
        playerImg.src = './gfx/player_1.png';
        break;
      case 0:
      default:
        playerImg.src = './gfx/player_0.png';
        break;
    }
  }

  init();

}
