'use strict';
var socket = io();
var pc;
var configuration = null;
var localVideo = document.getElementById('localvideo');
var remoteVideo = document.getElementById('remotevideo');
var canvas = document.getElementById('canvas');
var flag = false;

socket.on('join', function(current) {

    if(current === 1) {
        flag = true;
        hideShowElement(canvas, true);
        hideShowElement(remoteVideo, false);
        hideShowElement(localVideo, false);

        console.log("soy el priemro");


      
    }
    if(flag === false) {
        hideShowElement(canvas, false);
        hideShowElement(remoteVideo, true);
        hideShowElement(localVideo, true);

        console.log("soy el segundo");

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
        hideShowElement(canvas, false);
        hideShowElement(remoteVideo, true);
        hideShowElement(localVideo, true);
        remoteVideo.src = window.URL.createObjectURL(evt.stream);
    };

    // Detect when a user disconnect
    pc.oniceconnectionstatechange = function() {
        if(pc.iceConnectionState === 'disconnected') {
            console.log('Me cambiaron el estado');
            // window.location.reload();
        }
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ 'audio': true, 'video': {
      'optional': [
        {
            'minWidth': '1280'
        },
        {
            'minHeight': '720'
        }
        ],
        'mandatory': {

        } }}, function (stream) {

            localVideo.src = window.URL.createObjectURL(stream);
            pc.addStream(stream);
            //
            window.stream = stream;

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


$(window).keyup(function(key){

  //When "R" key
  if(key.keyCode === 82){
    //This part stop all the LOCAL tracks (Audio and Video)
    var tracks = window.stream.getTracks();

    tracks.forEach(t => t.enabled = !t.enabled);
    console.log('Entre');

  }
  
});



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

socket.on('redirect', function() {
    window.location = 'http://www.uptime.ly/wp-content/uploads/2014/12/tumblr_ms0p7wR1i51r0ufaco3_500.jpg';
});

socket.on('refresh', function() {
    window.location.reload();
});

function logFail (error) {
        console.log(error);
    }

function hideShowElement(element, status)
{
    element.style.display = (status)? 'inline' : 'none';
}
