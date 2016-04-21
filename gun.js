var request = require("request");
var wpi = require("wiring-pi");

var IRin = 12;
var ip = "192.168.30.154";

wpi.setup("phys");
wpi.pinMode(IRin, wpi.INPUT);
wpi.pullUpDnControl(IRin, wpi.PUD_DOWN);

wpi.wiringPiISR(IRin, wpi.INT_EDGE_BOTH, function(){
  //This part stop all the LOCAL tracks (Audio and Video)
   request('http://"+ip+":5000/trigger');
});
