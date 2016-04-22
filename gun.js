var wpi = require("wiring-pi"),
    http = require("http"),
    port = 5000,
    host = "https://portal-ns.herokuapp.com",
    method = "POST";

var IRin = 12;
var cut_video = true;
wpi.setup("phys");
wpi.pinMode(IRin, wpi.INPUT);
wpi.pullUpDnControl(IRin, wpi.PUD_DOWN);

wpi.wiringPiISR(IRin, wpi.INT_EDGE_FALLING, function(){
//This part stop all the LOCAL tracks (Audio and Video)
  if(!cut_video){

    http.request({
      method:method,
      host:host,
      port: port,
      path: "/on"
    }).end();

  }else{

    http.request({
      method:method,
      host:host,
      port: port,
      path: "/off"
    }).end();

  }

  cut_video = !cut_video;

});
