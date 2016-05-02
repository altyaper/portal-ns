var wpi = require("wiring-pi"),
    http = require("http"),
    port = process.env.PORT || 5000,
    host = "https://portal-ns.herokuapp.com",
    //host = "dev-portal-ns.herokuapp.com",
    method = "POST",
    restler = require('restler');

var IRin = 40;
var cut_video = true;
var R = 16;
var G = 18;
var B = 12;
var j = 0;
var ledOn = true;
var ascend = true;
var myToken = '1B724F94C3EDC1DA6FD7294D1C611';
wpi.setup("phys");
wpi.pinMode(IRin, wpi.INPUT);
wpi.pinMode(B, wpi.OUTPUT);
wpi.pinMode(R, wpi.OUTPUT);
wpi.pinMode(G, wpi.OUTPUT);
wpi.pullUpDnControl(IRin, wpi.PUD_DOWN);

wpi.wiringPiISR(IRin, wpi.INT_EDGE_FALLING, function(){
//This part stop all the LOCAL tracks (Audio and Video)
  //ledOn = !ledOn;
  if(!cut_video){
	console.log(" ---> ON");  
    restler.post(host+"/on", {
		data:{
			'token': myToken
		}
	}).on('complete', function(data, response){
		console.log("ON :=",data);
		cut_video = true;
	});

  } else {
	console.log(" ---> OFF");  
    restler.post(host+"/off", {
		data:{
			'token': myToken
		}
	}).on('complete', function(data, response){
		console.log("OFF :=",data);
		cut_video = false;
	});

  }

});

wpi.softPwmCreate(B,0,100); //B
wpi.softPwmCreate(R,0,100); //R
wpi.softPwmCreate(G,0,100); //G

setInterval(function(){
  if(!cut_video){
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
