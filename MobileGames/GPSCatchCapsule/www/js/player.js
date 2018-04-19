
function Player(id, type, callbackFunc) {

  var thiz = this;
  var playerImg = new Image(576, 256);
  var thinkingImg = new Image(50, 50);

  var xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.responseType = 'arraybuffer';
  xmlHttpRequest.onload = function() {
    thinkingImg.src = 'data:image/png;base64,' + encode(new Uint8Array(xmlHttpRequest.response));
  }


  var lookDirection = 'down';
  var stepCounter = 8;

  var spritePos = {
    'up': {
      'stepCount': 9,
      'steps': [
        [0, 0], [64, 0], [128, 0], [192, 0],
        [256, 0], [320, 0], [384, 0], [448, 0], [512, 0]
      ]
    },
    'left': {
      'stepCount': 9,
      'steps': [
        [0, 64], [64, 64], [128, 64], [192, 64],
        [256, 64], [320, 64], [384, 64], [448, 64], [512, 64]
      ]
    },
    'down': {
      'stepCount': 9,
      'steps': [
        [0, 128], [64, 128], [128, 128], [192, 128],
        [256, 128], [320, 128], [384, 128], [448, 128], [512, 128]
      ]
    },
    'right': {
      'stepCount': 9,
      'steps': [
        [0, 192], [64, 192], [128, 192], [192, 192],
        [256, 192], [320, 192], [384, 192], [448, 192], [512, 192]
      ]
    }
  };

  var spriteWidth = 64;
  var spriteHeight = 64;

  var x = 0;
  var y = 0;

  function encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
  }

  thiz.setPosition = function(xNew, yNew) {
    x = xNew;
    y = yNew;
  }

  thiz.setDirection = function(direction) {
    lookDirection = direction;
  }

  thiz.drawLoadedImage = function(ctx, imgPath) {
    if(imgPath) {
      if(ctx) {
        /*
        thinkingImg.onload = function() {
          ctx.drawImage(thinkingImg, x, y-(spriteHeight/2)-thinkingImg.height);
        }

        thinkingImg.src = imgPath;
        */

        xmlHttpRequest.open('GET', imgPath);
        xmlHttpRequest.send();
      }
    }
    else {
      //TODO: Dozent sagen dass Burger nicht weg geht!
      //thinkingImg.src = '';
    }
  }

  thiz.draw = function(ctx, deltaT) {
    if(ctx) {
      var sPos = spritePos[lookDirection].steps[stepCounter % spritePos[lookDirection].stepCount];

      ctx.drawImage(playerImg, sPos[0], sPos[1], spriteWidth, spriteHeight,
                    x-spriteWidth/2, y-spriteHeight/2, spriteWidth, spriteHeight);

      // THINKING IMAGE
      ctx.drawImage(thinkingImg, x, y-(spriteHeight/2)-thinkingImg.height);

      //deltaT
      stepCounter++;
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
