// Pixel.cpp - Library for using grid pixels.

#include "Arduino.h"
#include "Pixel.h"

Pixel::Pixel(int analogPos,  int touchRead, int touchSend, int motor, int dirUp, int dirDown, int ledR, int ledGround, int ledG, int ledB)
{
  _dirDown = dirDown;
  _dirUp = dirUp;
  _motor = motor;
  _analogPos = analogPos;

  _ledR = ledR;
  _ledG = ledG;
  _ledB = ledB;
  _ledGround = ledGround;
}

void Pixel::moveMotor(int action){

}

void Pixel::setColor(int red, int green, int blue){

}
void Pixel::setPID(int p, int i, int d){

}
void Pixel::setTarget(int target){

}

int Pixel::readAnalogPos(){

}
int Pixel::getPIDAction(){

}

