
#ifndef prog_uint8_t
#define prog_uint8_t const uint8_t
#endif

#include <Tlc5940.h>
#include <tlc_animations.h>
#include <tlc_config.h>
#include <tlc_fades.h>
#include <tlc_progmem_utils.h>
#include <tlc_servos.h>
#include <tlc_shifts.h>

struct pixel {
  int dirDown;
  int dirUp;
  
  int ledR;
  int ledG;
  int ledB;
  int motor;
  
  int actualPos;
  int desiredPos;
  int lastPos;
  int analogPos;
  
  double kI;
  double kP;
  double kD;
  
  int integral;
  int derivative;
  
  int allowSlide;
  int touchState;
  
  int red;
  int blue;
  int green;
};

const int numPixels = 2;
struct pixel pixels[numPixels];

int S0 = 7;
int S1 = 6;
int S2 = 5;
int S3 = 4;
int analogMux = A0;

int skips = 0;

char inData[20];

const int _posTop = 1000;
const int _posBottom = 0;
const int _posStop = 700;

void setup() {
  Serial.begin(9600);

  Tlc.init();
  pixels[0].motor = 0;
  pixels[0].desiredPos = 500;
  pixels[0].dirDown = 4;
  pixels[0].dirUp = 2;
  pixels[0].analogPos = A0;

  
  pixels[1].motor = 1;
  pixels[1].desiredPos = 500;
  pixels[1].dirDown = 6;
  pixels[1].dirUp = 7;
  pixels[1].analogPos = A1;

  
  pinMode(analogMux, INPUT);
  pinMode(pixels[0].dirDown, OUTPUT);
  pinMode(pixels[0].dirUp, OUTPUT);
  pinMode(pixels[1].dirDown, OUTPUT);
  pinMode(pixels[1].dirUp, OUTPUT);
  


}

void loop() {
  // put your main code here, to run repeatedly:
  serialRead();
  for (int i = 0; i < numPixels; i++) {
    pixels[i].actualPos = analogRead(pixels[i].analogPos);
    readPosition(i);
    int action = calculatePIDAction(i);
    setDirection(i, action);
  }
  Tlc.update();
}

//set channel on analog mux to read from
int setAnalogMux(int channel) {
  digitalWrite(S0, channel & 0b0001);
  digitalWrite(S1, channel & 0b0010);
  digitalWrite(S2, channel & 0b0100);
  digitalWrite(S3, channel & 0b1000);
}

//read value from certain channel of analog multiplexer
int analogMuxRead(int channel) {
  setAnalogMux(channel);
  return analogRead(analogMux);
}

//set the direction of the motor according to its dirUp and dirDown pins. dir=1 indicates upwards
void setDirection(int pixelNum, int dir) {
  if (dir > 0) {
    digitalWrite(pixels[pixelNum].dirUp, HIGH);
    digitalWrite(pixels[pixelNum].dirDown, LOW); 
  } else {
    digitalWrite(pixels[pixelNum].dirUp, LOW);
    digitalWrite(pixels[pixelNum].dirDown, HIGH); 
  }
}

//set Tlc (pwm multiplexer) channel value. Note: changes won't take effect until Tlc.update() is called
void setPWMValue(int channel, int value) {
  Tlc.set(channel, value);
}

//read current position of slider and update its respective stored value
void readPosition(int channel) {
  pixels[channel].actualPos = map(analogMuxRead(pixels[channel].analogPos),0,1023,_posBottom,_posTop);
  pixels[channel].actualPos = map(pixels[channel].actualPos, 680, 950, _posBottom, _posTop);
  pixels[channel].actualPos = constrain(pixels[channel].actualPos, _posBottom, _posTop);
}

//returns which direction to move according to PID calculations (also sets motor speed based on these calculations)
int calculatePIDAction(int channel) {
  
  if (pixels[channel].touchState == 1 && pixels[channel].allowSlide == 1) pixels[channel].desiredPos = pixels[channel].actualPos;
  
  int error = pixels[channel].desiredPos - pixels[channel].actualPos;
  pixels[channel].integral = pixels[channel].integral + error;
  
  pixels[channel].derivative = pixels[channel].lastPos - pixels[channel].actualPos;
  
  double drive = (error*pixels[channel].kP) + (pixels[channel].integral*pixels[channel].kI) + (pixels[channel].derivative*pixels[channel].kD);
  
  int motorSpeed = constrain(abs(map(drive,-500,500,-255,255)),0,255);
  if (motorSpeed < 150) motorSpeed = 0;
  setPWMValue(pixels[channel].motor, motorSpeed);
  
  if (drive < 0){
    return 0;
  }
  else{
    return 1;
  }
}

//read one command from serial interface and react accordingly
void serialRead() {
  int index = 0;
  char inChar;
  while (Serial.available() > 0 && Serial.peek() != 10)
  {
    if(index > 19) index = 0;// One less than the size of the array
    inData[index] = Serial.read(); // Read a character, store it
    index++; // Increment where to write next
  }
  
  if (strlen(inData) != 0 && Serial.peek() == 10) {
    Serial.read();
    int id = inData[0];
    if (sizeof(pixels) / sizeof(pixels[0]) <= id) return;
    
    if (inData[1] == 'C') {
      pixels[id].red = constrain(String(inData).substring(1,4).toInt(),0,255);
      pixels[id].green = constrain(String(inData).substring(4,7).toInt(),0,255);
      pixels[id].blue = constrain(String(inData).substring(7,10).toInt(),0,255);
    }
    
    if (inData[1] == 'P') {
      pixels[id].desiredPos = constrain(String(inData).substring(1,5).toInt(),0,1000);
    }
    
    if (inData[1] == 'A') {
      pixels[id].allowSlide = constrain(String(inData).substring(1,2).toInt(),0,1);
    }
        
    for (int i=0;i<19;i++) {
      inData[i]=0;
    }
  }
}
