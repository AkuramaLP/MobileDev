
function CommunicationMaster(pHash, playerChngdCb, onlineCb) {

  var thiz = this;

  var socket;
  
  function init() {
    socket = new WebSocket('ws://10.1.1.121:8080');
    socket.onopen = function() {
      if(socket && socket.readyState == 1) {
        var data = {
          pId: pHash,
          fCode: 0,
          position: {
            x: 0,
            y: 0
          }
        };
        
        console.log(data);
        socket.send(JSON.stringify(data));
      }
    };
    
    socket.onerror = function(error) {
      console.log('WebSocket Error ' + error);
    };
    
    socket.onmessage = function(e) {
      var data = JSON.parse(e.data);

      switch(data.fCode) {
        // Neuanmeldung
        case 0:
        // Positionsmitteilung
        case 1:
            if(data && data.pId && playerChngdCb) {
              playerChngdCb(
                {
                  pId: data.pId,
                  connected: true,
                  position: data.position
                }
              );
            }
            break;
        // Spielerabmeldung
        case 2:
          if(data && data.pId && playerChngdCb) {
            playerChngdCb(
              {
                pId: data.pId,
                connected: false
              }
            );
          }
          break;
        // Vorhandene Spieler werden dem neuen Spieler mitgeteilt
        case 3:
          if(data && data.existingPlayers) {
            for(var i=0; i<data.existingPlayers.length; i++) {
              playerChngdCb(
                {
                  pId: data.existingPlayers[i].pId,
                  connected: true,
                  position: data.existingPlayers[i].position
                }
              );
            }
          }
          break;
      }
    };
  }


  thiz.sendPosition = function(x, y) {
    if(socket && socket.readyState == 1) {
      var data = {
        pId: pHash,
        fCode: 1,
        position: {
          x: x,
          y: y
        }
      };
      
      socket.send(JSON.stringify(data));
    }
  };


  function onOffCb(isOnline) {
    if(isOnline) {
      if(onlineCb) {
        onlineCb();
      }

      init();

      navigator.notification.alert(
        'You are (back) online',
        null,
        'Online / Offline',
        'Thanks'
      );
    }
    else {
      navigator.notification.alert(
        'You are offline',
        null,
        'Online / Offline',
        'Thanks'
      );
    }
  }

  document.addEventListener('online', onOffCb(true));
  document.addEventListener('offline', onOffCb(false));

  init();
}
