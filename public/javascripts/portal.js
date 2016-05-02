'use strict';

var portalAnimation = new PortalAnimation();

var io;
var socket = io.connect(),
    pc,
    configuration = null,
    localVideo = document.getElementById('localvideo'),
    remoteVideo = document.getElementById('remotevideo'),
    flag = false,
    tracks,
    video,
    audio,
    audioOn = document.getElementById('portalOn'),
    audioOff = document.getElementById('portalOff'),
    room = $('#roomid').data('room');

socket.on('connect', function() {
    socket.emit('room', room);
});

socket.on('join', function(current) {

    if(current === 1) {
        flag = true;
        portalAnimation.comunication(false);
    }

    if(flag === false) {
        portalAnimation.comunication(true);
        start(true);
    }

});

socket.on('talk', function(evt) {

    audioOn.play();
    video.enabled = true;
    audio.enabled = true;
    portalAnimation.comunication(true);

});

socket.on('quiet', function(evt) {

    tracks = window.stream.getTracks();

    video = tracks[0];
    audio = tracks[1];

    audioOff.play();
    video.enabled = false;
    audio.enabled = false;

    portalAnimation.comunication(false);

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
    window.location.href = '/full';
});

socket.on('refresh', function() {
    window.location.reload();
});


// run start(true) to initiate a call
function start(isCaller) {

    // Create the Peer connection to the connected user
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        socket.emit('message', {type: 'candidate', data: evt.candidate});
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        portalAnimation.comunication(true);
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
    navigator.getUserMedia({ 'audio': true, 'video': true}, function (stream) {

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

$(window).keyup(function(key) {
    //When "R" key
    if(key.keyCode === 82) {
        switcher();
    }
});

function switcher() {
    //This part stop all the LOCAL tracks (Audio and Video)
    if(!window.stream) return;

    tracks = window.stream.getTracks();
    video = tracks[0];
    audio = tracks[1];

    if (video.enabled && audio.enabled) {
        socket.emit('quiet');
    }else {
        socket.emit('talk');
    }
    tracks.forEach(function(t) {
      t.enabled = !t.enabled;
  });

}

function logFail (error) {
    console.log(error);
}
