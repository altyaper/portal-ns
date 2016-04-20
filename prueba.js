var wpi = require('wiring-pi');
var out = 12;

wpi.setup("phys");

wpi.pinMode(out, wpi.OUTPUT);

wpi.digitalWrite(out, wpi.HIGH);

setTimeout(function() {
  wpi.digitalWrite(out, wpi.LOW);
}, 1000);

