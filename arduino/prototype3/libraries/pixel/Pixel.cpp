// Pixel.cpp - Library for using grid pixels.

#include "Arduino.h"
#include "Pixel.h"

Pixel::Pixel(int pin)
{
  pinMode(pin, OUTPUT);
  _pin = pin;
}

void Pixel::dot()
{
}

void Pixel::dash()
{
}

