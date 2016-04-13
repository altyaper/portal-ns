'use strict';
$(document).ready(function() {

    var socket = io();

    var hilovideo = document.getElementById('hilovideo');
    var cuuvideo = document.getElementById('cuuvideo');

    var constraints = window.constraints = {
        video: true,
        audio: true
    };

    navigator.getUserMedia(constraints, success, fail);

    function success(stream) {
        var url = window.URL.createObjectURL(stream);
        hilovideo.src = url;
        createPeerConnections(stream);
    }

    function fail(error) {
        console.error('Error: ', error);
    }


    function createPeerConnections(stream) {

        //We are using a LAN so we don't need a STUN server
        var config = null;

        var localPeer = new RTCPeerConnection(config);

        localPeer.onicecandidate = function(evt) {
            if(evt.candidate) {
                socket.emit('ice candidate hilo', evt.candidate);
            }
        };

        //Add the stream to the local RTCPeerConnection
        localPeer.addStream(stream);

        socket.on('remote description', function(desc) {

            //Setting the remote descrition
            localPeer.setRemoteDescription(new RTCSessionDescription(desc));

            //Time to create and Answer with out local description
            localPeer.createAnswer(function(desc) {

                //We put it as local
                localPeer.setLocalDescription(desc);

                //Then we emmit it
                socket.emit('hermosillo answer', desc);

            }, logError);

        });

        socket.on('ice candidate cuu', function(candidate) {
            var can = new RTCIceCandidate(candidate);
            localPeer.addIceCandidate(can);
        });

        //If everything is cool, then we have access to the stream
        localPeer.onaddstream = function gotRemoteStream (event) {
            var url = window.URL.createObjectURL(event.stream);
            cuuvideo.src = url;
        };

        function logError(error) {
            console.log('Error: ', error);
        }

    }

});
