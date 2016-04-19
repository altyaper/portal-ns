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

    // Detect when a user disconnect
    pc.oniceconnectionstatechange = function() {
        if(pc.iceConnectionState === 'disconnected') {
            window.location.reload();
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

  //When "L" key
  if(key.keyCode === 82){
    //This part stop all the LOCAL tracks (Audio and Video)
    var tracks = window.stream.getTracks();
    $.each(tracks, function(index, track){
      track.stop();
    });
  //When "R" key
  }else if(key.keyCode === 76){
    // TODO: This should stop the REMOTE stream

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
    window.location = 'https://www.google.com.mx/search?q=lleno&biw=1855&bih=995&source=lnms&tbm=isch&sa=X&ved=0ahUKEwidxe3p_pjMAhXlw4MKHfxtCN4Q_AUIBigB#imgrc=YUZmn4MLSo7PXM%3A';
});

socket.on('refresh', function() {
    window.location.reload();
});

function logFail (error) {
        console.log(error);
    }
