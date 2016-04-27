var wpi = require("wiring-pi"),
    http = require("http"),
    port = process.env.PORT || 5000,
    host = "portal-ns.herokuapp.com",
    method = "POST";

var IRin = 40;
var cut_video = true;
var R = 16;
var G = 18;
var B = 12;
var j = 0;
var ledOn = true;
var ascend = true;
wpi.setup("phys");
wpi.pinMode(IRin, wpi.INPUT);
wpi.pinMode(B, wpi.OUTPUT);
wpi.pinMode(R, wpi.OUTPUT);
wpi.pinMode(G, wpi.OUTPUT);
wpi.pullUpDnControl(IRin, wpi.PUD_DOWN);

wpi.wiringPiISR(IRin, wpi.INT_EDGE_FALLING, function(){
//This part stop all the LOCAL tracks (Audio and Video)
  ledOn = !ledOn;
  if(!cut_video){

    http.request({
      method:method,
      host:host,
      path: "/on"
    }).end();

  }else{

    http.request({
      method:method,
      host:host,
      path: "/off"
    }).end();

  }

  cut_video = !cut_video;

});

wpi.softPwmCreate(B,0,100); //B
wpi.softPwmCreate(R,0,100); //R
wpi.softPwmCreate(G,0,100); //G

setInterval(function(){
	if(!ledOn){
		if(j == 100) ascend = false;
		if(j == 0) ascend = true;
		writePWMHillo(j);
		if(ascend) j++;
		else j--;
	}
	else writePWMHillo(100);
	
},10);

writePWMHillo = function(i) {
	wpi.softPwmWrite(B,i); //B
	wpi.softPwmWrite(R, 0); //R
	wpi.softPwmWrite(G,0); //G
}

writePWMCuu = function(i) {
	wpi.softPwmWrite(B,0); //B
	wpi.softPwmWrite(R, i); //R
	wpi.softPwmWrite(G,Math.floor(0.08 * i)); //G
}
