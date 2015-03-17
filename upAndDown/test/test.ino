/*
1 - speed
2 - direction 
3 - direction

4 - direction 
5 - direction
6 - speed

7 - direction
8 - direction
9 - speed

10 - speed
11 - direction
12 - direction

analog channels
touch - potentiometer
01 - 1 (456)
23 - 2 (123)
45 - 4 (10 11 12)
67 - 7 (789)

selector pins:
S0 - 7
S1 - 6
S2 - 5
S3 - 4

*/
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

const int numPixels = 4;
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

const int MAX_MOTOR = 1600;
const int MIN_MOTOR = 0;
const int BUZZ_THRESHOLD = 100;
const int PWM_OFF = 4095;

void setup() {
  Serial.begin(9600);
  Tlc.init();
  Tlc.clear();
  
  pixels[0].motor = 1;
  pixels[0].desiredPos = 500;
  pixels[0].dirDown = 2;
  pixels[0].dirUp = 3;
  pixels[0].analogPos = 2;
  pixels[0].integral = 0;
  pixels[0].derivative = 0;
  pixels[0].kP = 0.6;
  pixels[0].kD = 0.2;
  pixels[0].kI = 0.02;
  
  pixels[1].motor = 6;
  pixels[1].desiredPos = 500;
  pixels[1].dirDown = 7;
  pixels[1].dirUp = 8;
  pixels[1].analogPos = 1;
  pixels[1].integral = 0;
  pixels[1].derivative = 0;
  pixels[0].kP = 0.6;
  pixels[0].kD = 0.2;
  pixels[0].kI = 0.02;
  
  pixels[2].motor = 9;
  pixels[2].desiredPos = 500;
  pixels[2].dirDown = 10;
  pixels[2].dirUp = 11;
  pixels[2].analogPos = 7;
  pixels[2].integral = 0;
  pixels[2].derivative = 0;
  pixels[0].kP = 0.6;
  pixels[0].kD = 0.2;
  pixels[0].kI = 0.02;
  
  pixels[3].motor = 12;
  pixels[3].desiredPos = 500;
  pixels[3].dirDown = 13;
  pixels[3].dirUp = 14;
  pixels[3].analogPos = 4;
  pixels[3].integral = 0;
  pixels[3].derivative = 0;
  pixels[0].kP = 0.6;
  pixels[0].kD = 0.2;
  pixels[0].kI = 0.02;
  
  pinMode(analogMux, INPUT);
  pinMode(S0,OUTPUT);
  pinMode(S1,OUTPUT);
  pinMode(S2,OUTPUT);
  pinMode(S3,OUTPUT);

}

void loop() {
  // put your main code here, to run repeatedly:
  serialRead();
  for (int i = 0; i < 1; i++) {
    pixels[i].actualPos = analogMuxRead(pixels[i].analogPos);
    //readPosition(i);
    int action = calculatePIDAction(i);
    //setPWMValue(pixels[i].motor, 1600);
    padPrint(action, 3);

    //setPWMValue(pixels[i].motor, 0);
    setDirection(i, action);
  }
  
  /*for (int i = 0; i < numPixels; i++) {
    padPrint(pixels[i].actualPos, 3);
    Serial.print(" ");
  }
  Serial.println("");*/
  Tlc.update();
}

//set channel on analog mux to read from
void setAnalogMux(int channel) {
  digitalWrite(S3, HIGH && (channel & B00001000));
  digitalWrite(S2, HIGH && (channel & B00000100));
  digitalWrite(S1, HIGH && (channel & B00000010));
  digitalWrite(S0, HIGH && (channel & B00000001));
}

//read value from certain channel of analog multiplexer
int analogMuxRead(int channel) {
  setAnalogMux(channel);
  return map(analogRead(analogMux),0,1023,0,1000);
}

//set the direction of the motor according to its dirUp and dirDown pins. dir=1 indicates upwards
void setDirection(int i, int dir) {
  if (dir > 0) {
     //digitalWrite(pixels[pixelNum].dirUp, HIGH);
     //digitalWrite(pixels[pixelNum].dirDown, LOW); 
     setPWMValue(pixels[i].dirUp, 0);    
     setPWMValue(pixels[i].dirDown, 4000);
  } else {
    setPWMValue(pixels[i].dirUp, 4000);
    setPWMValue(pixels[i].dirDown, 0);
    //digitalWrite(pixels[pixelNum].dirUp, LOW);
    //digitalWrite(pixels[pixelNum].dirDown, HIGH); 
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
  
  //if (pixels[channel].touchState == 1 && pixels[channel].allowSlide == 1) pixels[channel].desiredPos = pixels[channel].actualPos;
  
  int error = pixels[channel].desiredPos - pixels[channel].actualPos;
  pixels[channel].integral = pixels[channel].integral + error;
  
  pixels[channel].derivative = pixels[channel].lastPos - pixels[channel].actualPos;
  
  double drive = (error*pixels[channel].kP) + (pixels[channel].integral*pixels[channel].kI) + (pixels[channel].derivative*pixels[channel].kD);
    Serial.print(drive);

  int motorSpeed = constrain(abs(map(abs(drive),0,500, 0,MAX_MOTOR)),0, MAX_MOTOR);
  Serial.println();
  //if (motorSpeed < 150) motorSpeed = 0;
  if (motorSpeed < BUZZ_THRESHOLD) {
    setPWMValue(pixels[channel].motor, PWM_OFF);
  } else {
    setPWMValue(pixels[channel].motor, MAX_MOTOR - motorSpeed);
  }
  
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

void padPrint(int value, int width)
{
  // pads values with leading zeros to make the given width
  char valueStr[6]; // large enough to hold an int
  itoa (value, valueStr, 10);
  int len = strlen(valueStr);
  if(len < width){
    len = width-len;
    while(len--)
     Serial.print(' ');
  }
 Serial.print(valueStr);   
}
