'use strict';
$(document).ready(function() {
    var socket = io();
    var pc;
    var configuration = null;
    var localVideo = document.getElementById("localvideo");
    var remoteVideo = document.getElementById("remotevideo");

// run start(true) to initiate a call
function start(isCaller) {
    pc = new RTCPeerConnection(configuration);

    // send any ice candidates to the other peer
    pc.onicecandidate = function (evt) {
        socket.emit("message", {type:"candidate", data:evt.candidate});
    };

    // once remote stream arrives, show it in the remote video element
    pc.onaddstream = function (evt) {
        remoteVideo.src = window.URL.createObjectURL(evt.stream);
    };

    // get the local stream, show it in the local video element and send it
    navigator.getUserMedia({ "audio": true, "video": true }, function (stream) {

        localVideo.src = window.URL.createObjectURL(stream);
        console.log("isCaller? " + isCaller);
        pc.addStream(stream);

        if (isCaller){
            pc.createOffer(gotDescription);          
        }
        else{
            pc.createAnswer(gotDescription, 
              function(error){
                  console.log(error);
              });
        }

        function gotDescription(desc) {
            pc.setLocalDescription(desc);
            socket.emit("message", {type:"description", data:desc});
        }
    }, function(error){
      console.log(error);
    });
}


socket.on("message", function(evt){
  console.log(evt);
      if (!pc)
        start(false);

    if (evt.type == "description")
        pc.setRemoteDescription(new RTCSessionDescription(evt.data));
    else if (evt.type == "candidate")
        pc.addIceCandidate(new RTCIceCandidate(evt.data));
});
    

    function setConnectionDone(){
      $("#fullscreen").addClass("active");
      $(".center-portal").fadeOut();
    }
});
