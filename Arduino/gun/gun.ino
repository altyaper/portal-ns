// This sketch will send out a Nikon D50 trigger signal (probably works with most Nikons)
// See the full tutorial at http://www.ladyada.net/learn/sensors/ir.html
// this code is public domain, please enjoy!
#include <RCSwitch.h>

//Instacia a Biblioteca RF
RCSwitch mySwitch = RCSwitch();

int IRledPin =  2;    // LED connected to digital pin 13
int inPin = 12;  // the pin number for input (for me a push button)

int current;         // Current state of the button
                     // (LOW is pressed b/c i'm using the pullup resistors)
long millis_held;    // How long the button was held (milliseconds)
long secs_held;      // How long the button was held (seconds)
long prev_secs_held; // How long the button was held in the previous check
byte previous = LOW;
unsigned long firstTime; // how long since the button was first pressed 
 
// The setup() method runs once, when the sketch starts
 
void setup()   {                
  // initialize the IR digital pin as an output:
  pinMode(IRledPin, OUTPUT);
  pinMode(inPin, INPUT);
 
  Serial.begin(9600);
  mySwitch.enableTransmit(10);
  delay(50);
}
 
void loop()                     
{
  current = digitalRead(inPin);
  mySwitch.send(2, 24);
  
  
  // if the button state changes to pressed, remember the start time 
  if (current == HIGH && previous == LOW && (millis() - firstTime) > 50) {
    firstTime = millis();
    mySwitch.send(1, 24);

  }

  millis_held = (millis() - firstTime);
  secs_held = millis_held / 1000;

  // This if statement is a basic debouncing tool, the button must be pushed for at least
  // 100 milliseconds in a row for it to be considered as a push.
  
  if (millis_held > 50) {

    // check if the button was released since we last checked
    if (current == LOW && previous == HIGH) {
      
      // Button pressed for less than 1 second, one long LED blink

      // If the button was held for 3-6 seconds blink LED 10 times
      if (secs_held >= 3) {
        SendNikonCode();
      }
    }
  }

  previous = current;
  prev_secs_held = secs_held;
}
 
// This procedure sends a 38KHz pulse to the IRledPin 
// for a certain # of microseconds. We'll use this whenever we need to send codes
void pulseIR(long microsecs) {
  // we'll count down from the number of microseconds we are told to wait
 
  cli();  // this turns off any background interrupts
 
  while (microsecs > 0) {
    // 38 kHz is about 13 microseconds high and 13 microseconds low
   digitalWrite(IRledPin, HIGH);  // this takes about 3 microseconds to happen
   delayMicroseconds(10);         // hang out for 10 microseconds, you can also change this to 9 if its not working
   digitalWrite(IRledPin, LOW);   // this also takes about 3 microseconds
   delayMicroseconds(10);         // hang out for 10 microseconds, you can also change this to 9 if its not working
 
   // so 26 microseconds altogether
   microsecs -= 26;
  }
 
  sei();  // this turns them back on
}
 
void SendNikonCode() {
  // This is the code for my particular Nikon, for others use the tutorial
  // to 'grab' the proper code from the remote
 
  delayMicroseconds(40056);//1
  pulseIR(7650);
  delayMicroseconds(4380);//2
  pulseIR(400);
  delayMicroseconds(600);//3
  pulseIR(400);
  delayMicroseconds(600);//4
  pulseIR(400);
  delayMicroseconds(1700);//5///////////
  pulseIR(400);
  delayMicroseconds(600);//6
  pulseIR(400);
  delayMicroseconds(600);//7
  pulseIR(400);
  delayMicroseconds(600);//8
  pulseIR(400);
  delayMicroseconds(600);//9
  pulseIR(400);
  delayMicroseconds(600);//10
  pulseIR(400);
  delayMicroseconds(1700);//11
  pulseIR(400);
  delayMicroseconds(1700);//12
  pulseIR(400);
  delayMicroseconds(600);//13
  pulseIR(400);
  delayMicroseconds(1700);//14
  pulseIR(400);
  delayMicroseconds(1700);//15
  pulseIR(400);
  delayMicroseconds(1700);//16
  pulseIR(400);
  delayMicroseconds(1700);//17
  pulseIR(400);
  delayMicroseconds(1700);//18
  pulseIR(400);
  delayMicroseconds(600);//19
  pulseIR(400);
  delayMicroseconds(600);//20
  pulseIR(400);
  delayMicroseconds(600);//21
  pulseIR(400);
  delayMicroseconds(1700);//22
  pulseIR(400);
  delayMicroseconds(600);//23
  pulseIR(400);
  delayMicroseconds(600);//24
  pulseIR(400);
  delayMicroseconds(600);//25
  pulseIR(400);
  delayMicroseconds(600);//26
  pulseIR(400);
  delayMicroseconds(1700);//27
  pulseIR(400);
  delayMicroseconds(1700);//28
  pulseIR(400);
  delayMicroseconds(1700);//29
  pulseIR(400);
  delayMicroseconds(600);//30
  pulseIR(400);
  delayMicroseconds(1700);//31
  pulseIR(400);
  delayMicroseconds(1700);//32
  pulseIR(400);
  delayMicroseconds(1700);//33
  pulseIR(400);
  delayMicroseconds(1700);//34
  pulseIR(400);
//  delayMicroseconds(39780);//35
//  pulseIR(9060);
//  delayMicroseconds(2160);//35
}
