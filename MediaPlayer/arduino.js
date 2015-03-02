function Arduino (onLineReceived) {

  var _self = this;
  _self.connectionId = -1;

  _self.writeSerial = function(str) {
    str += '\n';
    if (_self.connectionId > -1);
      chrome.serial.send(_self.connectionId, convertStringToArrayBuffer(str), function(){ console.log("write "+ str) });
  }

  function onConnect(connectionInfo) {
    if (connectionInfo == null) return
      _self.connectionId = connectionInfo.connectionId;
  }
  chrome.serial.connect("/dev/tty.usbmodem1421", {bitrate: 9600}, onConnect);

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