//Pixel.h - Library for flashing Morse code.

#ifndef Pixel_h
#define Pixel_h

#include "Arduino.h"

class Pixel
{
  public:
    Pixel(int analogPos,  int touchRead, int touchSend, int motor, int dirUp, int dirDown, int ledR, int ledGround, int ledG, int ledB);
    
    void moveMotor(int action);

    void setColor(int red, int green, int blue);
    void setPID(int p, int i, int d);
    void setTarget(int target);

    int readAnalogPos();
    int getPIDAction();

    const int _ledR;
    const int _ledG;
    const int _ledB;
    const int _ledGround;

  private:
    const int _dirDown;
    const int _dirUp;
    const int _motor;
    const int _analogPos;

    int desiredPos;
    int currentPos;
    int lastPos;
    int integral;
    
    double kI;
    double kP;
    double kD;

    int touchState;
    
    int red;
    int blue;
    int green;
};

#endif