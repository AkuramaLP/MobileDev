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
        case 0:
            conPlayerId = data.pId;
            pSockets[data.pId] = ws;
            console.log("got id");
            break;

        case 1:
            for(pS in pSockets) {
                if(pS != data.pId) {
                    pSockets[ps].send(message);
                }
            }
            break;
      }
    });

    ws.on('close', function close() {
        delete pSockets[conPlayerId];
        delete conPlayerId;

        for(pS in pSockets) {
            pSockets[ps].send(message);   
        }
    });
   
    ws.send('something');
  });