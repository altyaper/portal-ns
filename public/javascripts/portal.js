'use strict';

var socket = io(),
    pc,
    configuration = null,
    localVideo = document.getElementById('localvideo'),
    remoteVideo = document.getElementById('remotevideo'),
    canvas = document.getElementById('canvas'),
    flag = false,
    tracks,
    video,
    audio,
    portalparam = window.location.search.split('=')[1],
    portal,
    animation,
    audioOn = document.getElementById('portalOn'),
    audioOff = document.getElementById('lportalOff');


var portales = {
    'cuu' : {
        'color' : {
            'r' : 255,
            'g' : 130,
            'b' : 0
        },
        'greeting' : 'hello Chihuahua'
    },
    'hmo' : {
        'color' : {
            'r' : 1,
            'g' : 80,
            'b' : 255
        },
        'greeting' : 'hello HMO'
    },
    'cdmx' : {
        'color' : {
            'r' : 3,
            'g' : 40,
            'b' : 155
        },
        'greeting' : 'hello CDMX'
    },
    'default': {
        'color' : {
            'r' : 50,
            'g' : 50,
            'b' : 55
        }
    }
};

if(portalparam) {
    portal = portales[portalparam];
}else {
    portal = portales['default'];
}


socket.on('join', function(current) {

    if(current === 1) {
        flag = true;
        comunication(false);
    }
    if(flag === false) {
        comunication(true);
        start(true);
    }

});

socket.on('talk', function(evt) {

    // socket.emit('refresh');
    // tracks = window.stream.getTracks();
    // video = tracks[0];
    // audio = tracks[1];
    //
    portalOn.play();
    video.enabled = true;
    audio.enabled = true;
    
    comunication(true);

});

socket.on('quiet', function(evt) {

    tracks = window.stream.getTracks();
    video = tracks[0];
    audio = tracks[1];

    portalOff.play();
    video.enabled = false;
    audio.enabled = false;

    comunication(false);

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
        comunication(true);
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
        'optional': [{'minWidth': '1280'},{'minHeight': '720'}],
        'mandatory': {}
    },
    'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]}, function (stream) {

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

function comunication(enable) {
    canvas.style.display = (enable)? 'none' : 'inline';
    if (enable) {
        stopAnimate();
    }else {
        animate();
    }
    remoteVideo.style.display = (enable)? 'inline' : 'none';
    localVideo.style.display = (enable)? 'inline' : 'none';
}

function stopAnimate() {
    if (animation !== undefined) {
        clearInterval(animation);
        animation = undefined;
    }
}

function animate() {
    animation = setInterval(function() {
        init();
    }, 0);
    return animation;
}

function init() {

    var palette;
    var paletteoffset = 0;
    var cv = document.getElementById('canvas');
    var ctx = cv.getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var height = cv.height;
    var width = cv.width;
    // plasma source width and height
    var pwidth = 200, pheight = pwidth * (height /width);
    // scale the plasma source to the canvas width/height
    var vpx = width /pwidth, vpy = height /pheight;
    var time = Date.now() / 20;

    // initialisation
    if (typeof palette === 'undefined') {
        palette = [];
        for (var i =0,r,g,b; i <256; i++) {
            r = ~~(portal.color.r + 0.2 * Math.sin(Math.PI * i / 32));
            g = ~~(portal.color.g + 10 * Math.sin(Math.PI * i / 64));
            b = ~~(portal.color.b + 10 * Math.sin(Math.PI * i / 128));
            palette[i] = 'rgb(' + ~~r + ',' + ~~g + ',' + ~~b + ')';
        }
    }

    var dist = function dist (a, b, c, d) {
        return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
    };



    var colour = function(x, y) {
        // plasma function
        return (128 + (128 * Math.sin(x * 0.0625)) +
                128 + (128 * Math.sin(y * 0.03125)) +
                128 + (128 * Math.sin(dist(x + time, y - time, width, height) * 0.125)) +
                128 + (128 * Math.sin(Math.sqrt(x * x + y * y) * 0.125)) ) * 0.25;
    };

    // render plasma effect
    for (var y =0,x; y <pheight; y++) {
        for (x =0; x <pwidth; x++) {
            // map plasma pixels to canvas pixels using the virtual pixel size
            ctx.fillStyle = palette[~~(colour(x, y) + paletteoffset) % 256];
            ctx.fillRect(Math.floor(x * vpx), Math.floor(y * vpy), Math.ceil(vpx), Math.ceil(vpy));
        }
    }

    // palette cycle speed
    paletteoffset++;
}
