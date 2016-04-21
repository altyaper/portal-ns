var wpi = require("wiring-pi");

var IRin = 12;

wpi.setup("phys");
wpi.pinMode(IRin, wpi.INPUT);
wpi.pullUpDnControl(IRin, wpi.PUD_DOWN);

wpi.wiringPiISR(IRin, wpi.INT_EDGE_FALLING, function(){
  //This part stop all the LOCAL tracks (Audio and Video)
 console.log("Pressed");
  var tracks = window.stream.getTracks();

  tracks.forEach(t => t.enabled = !t.enabled);
    console.log('Entre');
});
