function Arduino (onLineReceived) {

  var _self = this;
  _self.connectionId = -1;

  _self.writeSerial = function(str) {
    str += '\n';
    if (_self.connectionId > -1) {
      chrome.serial.send(_self.connectionId, convertStringToArrayBuffer(str), function(){ });
      //console.log("write "+ str) });
    } else console.log("Can't write without a connection");
  }

  _self.getPorts = function(callback) {
    chrome.serial.getDevices(function(ports) {
      callback(ports);
    });
  }

  _self.connect = function(port, bitrate) {
    if (_self.connectionId != -1) chrome.serial.disconnect(_self.connectionId, function(success) {
      if (success) {
        console.log('disconnected from connection ' + _self.connectionId);
        _self.connectionId = -1
      }
    })
    chrome.serial.connect(port, bitrate, onConnect);
  }

  function onConnect(connectionInfo) {
    console.log(connectionInfo);
    if (connectionInfo == null) {
      console.log("Couldn't connect to arduino");
      console.log(chrome.runtime.lastError);
      return
    };
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

  chrome.serial.onReceive.addListener(onReceiveCallback);
}