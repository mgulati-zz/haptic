function Arduino (onLineReceived) {

  var _self = this;
  _self.connectionId = -1;
  _self.connected = false;
  pollTime = currentTime();
  chrome.serial.getConnections(function(connections) {
    if (connections.length > 0) _self.connectionId = connections[0].connectionId;
  });

  _self.writeSerial = function(str) {
    str += '\n';
    if (_self.connectionId > -1) {
      chrome.serial.send(_self.connectionId, convertStringToArrayBuffer(str), function() {
        //console.log("write "+ str) });
      });
    } 
    // else console.log("Can't write without a connection");
    // console.log(str);
  }

  _self.getPorts = function(callback) {
    chrome.serial.getDevices(function(ports) {
      callback(ports);
    });
  }

  _self.connect = function(port, options) {
    if (_self.connectionId != -1) chrome.serial.disconnect(_self.connectionId, function(success) {
      if (success) {
        console.log('disconnected from connection ' + _self.connectionId);
        _self.connectionId = -1
      }
    })
    chrome.serial.connect(port, options, onConnect);
  }

  function onConnect(connectionInfo) {
    console.log(connectionInfo);
    if (connectionInfo == null) {
      console.log("Couldn't connect to arduino");
      console.log(chrome.runtime.lastError);
      return
    };
    _self.connected = true;
    _self.connectionId = connectionInfo.connectionId;
  }

  // Convert string to ArrayBuffer
  function convertStringToArrayBuffer(str) {
    var buf=new ArrayBuffer(str.length);
    var bufView=new Uint8Array(buf);
    for (var i=0; i<str.length; i++) {
      bufView[i]=str.charCodeAt(i);
    }
    return buf;
  }

  /* Interprets an ArrayBuffer as UTF-8 encoded string data. */
  function convertArrayBufferToString(buf) {
    var bufView = new Uint8Array(buf);
    var encodedString = String.fromCharCode.apply(null, bufView);
    return encodedString;
  };

  var stringReceived = '';
  function onReceiveCallback(info) {
    pollTime = currentTime();
    if (info.data) {
      var str = convertArrayBufferToString(info.data);
      if (str.charAt(str.length-1) === '\n') {
        stringReceived += str.substring(0, str.length-1);
        stringsRecieved = stringReceived.split('\n');
        stringsRecieved.forEach(function(strRec) {
          onLineReceived(strRec);
        })
        stringReceived = '';
      } else {
        stringReceived += str;
      }
    }
  };

  function connectionPoll() {
    if (currentTime() - pollTime > 1000) {
      _self.connected = false;
      _self.getPorts(function(ports) {
        if (ports[ports.length-1].path.indexOf('tty.usbmodem') > -1) {
          _self.connect(ports[ports.length - 1].path,{'bitrate': 115200});
        }
      });
    } else {
      _self.connected = true;
    }
    updateConnectionDisp();
  }

  function updateConnectionDisp() {
    console.log(_self.connected);
    $(".connection").css("background-color", _self.connected ? "#00FF00" : "#FF0000");
  }

  function currentTime() {
    return new Date().getTime();
  }

  setInterval(connectionPoll, 1000);

  chrome.serial.onReceive.addListener(onReceiveCallback);
}