function CommunicationMaster (pHash) {

  var thiz = this;

  var socket = new WebSocket('ws://192.168.178.72:8080');

  socket.onopen = function() {
    if(socket && socket.readyState == 1) {
      var data = {
        pId: pHash,
        fCode: 0
      };

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
