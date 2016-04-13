'use strict';
$(document).ready(function() {
    var socket = io();

    var cuuvideo  = document.getElementById('cuuvideo');
    var hilovideo  = document.getElementById('hilovideo');

    var constraints = window.constraints = {
        video: true,
        audio: true
    };

    navigator.getUserMedia(constraints, success, fail);

  function success(stream){
    var url = window.URL.createObjectURL(stream);
    cuuvideo.src = url;
    createPeerConnections(stream);
  }

    function fail(error) {
        console.error('Error: ', error);
    }


    function createPeerConnections(stream) {

        var config = null;

        var localPeer = new RTCPeerConnection(config);

        localPeer.onicecandidate = function gotMyIceCandidate (evt) {
            if(evt.candidate) {
                socket.emit('ice candidate cuu', evt.candidate);
            }
        }

        localPeer.addStream(stream);

        localPeer.createOffer(function gotLocalDescription (desc) {

            localPeer.setLocalDescription(desc);

            socket.emit('remote description', desc);

            socket.on('hermosillo answer', function(desc) {
                localPeer.setRemoteDescription(new RTCSessionDescription(desc));
            });

        }, function(error) {
            console.log('Error in offer: ', error);
        });

        socket.on('ice candidate hilo', function(candidate) {
            var can = new RTCIceCandidate(candidate);
            localPeer.addIceCandidate(can);
        });

    localPeer.onaddstream = function(evt){
      console.log("Recived stream from Hermosillo");
      console.log(evt);
      var url = window.URL.createObjectURL(evt.stream);
      hilovideo.src = url;
    }

    }

});
