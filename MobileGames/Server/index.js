const WebSocket = require('ws');

//List of connected players
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
        //Client Connected to server

        case 0:
            //Get Player ID form JSON Data
            conPlayerId = data.pId;
            //Add Client to List of connected Clients
            pSockets[data.pId] = ws;
            console.log("got id");
            break;

        //Client sends Position
        case 1:
            for(pS in pSockets) {
                //Check if current element isnt the sender
                if(pS != data.pId) {
                    //sends Position to client
                    pSockets[ps].send(message);
                }
            }
            break;
      }
    });

    //Client disconnected
    ws.on('close', function close() {
        delete pSockets[conPlayerId];
        delete conPlayerId;

        //Send all clients that a userhas disconnected
        for(pS in pSockets) {
            pSockets[ps].send(message);
        }
    });

    ws.send('something');
  });
