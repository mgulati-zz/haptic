//Pixel.h - Library for flashing Morse code.

#ifndef Pixel_h
#define Pixel_h

#include "Arduino.h"

class Pixel
{
  public:
    Pixel(int pin);
    ~Pixel();
  
  private:
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

#endif