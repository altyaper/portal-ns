'use strict';
var socket = io();
var pc;
var configuration = null;
var localVideo = document.getElementById('localvideo');
var remoteVideo = document.getElementById('remotevideo');
var flag = false;

socket.on('join', function(current) {

    if(current === 1) {
        flag = true;
    }
    if(flag === false) {
        start(true);
    }

});

// run start(true) to initiate a call
function start(isCaller) {

    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        socket.emit('message', {type: 'candidate', data: evt.candidate});
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        remoteVideo.src = window.URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ 'audio': true, 'video': true }, function (stream) {

        localVideo.src = window.URL.createObjectURL(stream);
        pc.addStream(stream);

        if (isCaller) {
            pc.createOffer(gotDescription, logFail);
        }else {
            pc.createAnswer(gotDescription, logFail);
        }

        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            socket.emit('message', {type: 'description', data: desc});
        }

    }, logFail);
}


socket.on('message', function(evt) {
    if (!pc) {
        start(false);
    }

    if (evt.type === 'description') {
        pc.setRemoteDescription(new RTCSessionDescription(evt.data));

    }else if (evt.type === 'candidate') {

        if(evt.data) {
            var candidate = new RTCIceCandidate(evt.data);
            pc.addIceCandidate(candidate, function(success) {
            }, logFail);
        }

    }

});

function logFail (error) {
        console.log(error);
    }
