var wpi = require('wiring-pi');
var input = 12;
wpi.setup("phys");

wpi.pinMode(input, wpi.INPUT);

setInterval(function(){
  if(wpi.digitalRead(input) == wpi.HIGH) setDelay();
}, 100);

function setDelay(){
  setTimeout(function(){
    console.log("Hola!");
  },10);
}
