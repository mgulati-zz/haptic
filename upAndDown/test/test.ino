
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
  int analogPos;
  
  double kI;
  double kP;
  double kD;
  
  int allowSlide;

  int motorDirectionDown;
};

const int numPixels = 2;
struct pixel pixels[numPixels];

int S0 = 0;
int S1 = 0;
int S2 = 0;
int S3 = 0;
int analogMux = A0;

int skips = 0;

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
  skips += 1;
  for (int i = 0; i < numPixels; i++) {
    pixels[i].actualPos = analogRead(pixels[i].analogPos);
    if (skips > 20) {
      pixels[i].desiredPos += 5;
    }
    setDirection(i);
    if (pixels[i].desiredPos > 1023) pixels[i].desiredPos = 0;
  }
  if (skips > 20) {
    skips = 0;
  }
  Tlc.clear();
  Tlc.set(pixels[0].motor, 200);
  Tlc.set(pixels[1].motor, 200);
  Tlc.update();
  //Serial.println("");
}

int setAnalogMux(int channel) {
  analogWrite(S0, channel & 0b0001);
  analogWrite(S1, channel & 0b0010);
  analogWrite(S2, channel & 0b0100);
  analogWrite(S3, channel & 0b1000);
}

int analogMuxRead(int channel) {
  setAnalogMux(channel);
  return analogRead(analogMux);
}

void setDirection(int pixelNum) {
  int diff = pixels[pixelNum].desiredPos - pixels[pixelNum].actualPos;
  if (diff > 0) {
    digitalWrite(pixels[pixelNum].dirUp, HIGH);
    digitalWrite(pixels[pixelNum].dirDown, LOW); 
  } else {
    digitalWrite(pixels[pixelNum].dirUp, LOW);
    digitalWrite(pixels[pixelNum].dirDown, HIGH); 
    //Serial.print("DOWN");
  }
}

//int analogMuxWrite(int channel, int value) {
//  setAnalogMux(channel);
//  analogWrite(analogMux, value);
//}
