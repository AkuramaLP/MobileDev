//fCodes: 0 - Connection message
//        1 - Poistion Message

function CommunicationMaster (pHash) {

  var thiz = this;

  var socket = new WebSocket('ws://192.168.178.72:8080');

  //onopen = EVENT
  //readyState = Connected?
  socket.onopen = function() {
    if(socket && socket.readyState == 1) {
      var data = {
        pId: pHash,
        fCode: 0
      };

      //Convert JSON object to string
      socket.send(JSON.stringify(data));
    }
  };

  // Log errors
  socket.onerror = function(error) {
    console.log('WebSocket Error ' + error);
  };

  // Log messages from the server
  socket.onmessage = function(e) {
    console.log('Server: ' + e.data);
  };

  //Position Update
  //pId = player ID
  //fCode: function Code
  //X: x Position
  //Y: y Position
  thiz.sendPosition = function(x, y) {
    if(socket && socket.readyState == 1) {
      var data = {
        pId: pHash,
        fCode: 1,
        x: x,
        y: y
      };

      socket.send(JSON.stringify(data));
    }
  };

}
