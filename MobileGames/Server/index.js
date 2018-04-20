const WebSocket = require('ws');

var pSockets = {};


const wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: false
});

wss.on('connection', function connection(ws) {
    var conPlayerId = null;

    ws.on('message', function incoming(message) {
      var data = JSON.parse(message);

      switch(data.fCode) {
        // Neuanmeldung
        case 0:
            if(data && data.pId) {
                conPlayerId = data.pId;

                var dataToSend = new Array();

                for(var pS in pSockets) {
                    pSockets[pS].socket.send(message);

                    dataToSend.push({
                        pId: pS,
                        position: pSockets[pS].position
                    });
                }

                ws.send(JSON.stringify(
                    {
                        fCode: 3,
                        existingPlayers: dataToSend
                    }
                ));

                pSockets[data.pId] = {
                    socket: ws,
                    position: {
                        x: 0,
                        y: 0
                    }
                };
                
                console.log("Connected: " + conPlayerId);
            }
            break;
        // Positionsmitteilung
        case 1:
            if(data.pId) {
                if(data.position) {
                    pSockets[data.pId].position = data.position;
                }

                for(var pS in pSockets) {
                    if(pS != data.pId) {
                        pSockets[pS].socket.send(message);
                    }
                }
            }
            
            break;
      }
    });

    ws.on('close', function close() {
        var data = {
            pId: conPlayerId,
            // Player abgemeldet
            fCode: 2
        };

        delete pSockets[conPlayerId];

        console.log("Disconnected: " + conPlayerId);
        delete conPlayerId;

        for(var pS in pSockets) {
            pSockets[pS].socket.send(JSON.stringify(data));
        }
    });

    //ws.send('something');
});