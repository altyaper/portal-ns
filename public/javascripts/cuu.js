'use strict';
$(document).ready(function() {

    var islocal = true;

    var socket = io();

    var localvideo  = document.getElementById('localvideo');
    var remotevideo  = document.getElementById('remotevideo');

    var constraints = {
        video: true,
        audio: true
    };

    socket.on('give me islocal', function(islocals) {
        islocal = islocals;
    });

    navigator.getUserMedia(constraints, success, fail);

    function success(stream) {
        var url = window.URL.createObjectURL(stream);
        localvideo.src = url;
        createPeerConnections(stream);
    }

    function fail(error) {
        console.error('Error: ', error);
    }


    function createPeerConnections(stream) {

        var config = null;

        var localPeer = new RTCPeerConnection(config);

        localPeer.addStream(stream);

        localPeer.createOffer(function (desc) {

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

        localPeer.onaddstream = function(evt) {
            var url = window.URL.createObjectURL(evt.stream);
            setConnectionDone();
            remotevideo.src = url;
        };

        localPeer.onicecandidate = function (evt) {
            if(evt.candidate) {
                socket.emit('ice candidate cuu', evt.candidate);
            }
        };

    }

    function setConnectionDone() {
        $('#fullscreen').addClass('active');
        $('.center-portal').fadeOut();
    }
});
