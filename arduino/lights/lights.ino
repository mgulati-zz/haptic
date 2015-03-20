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

const int PWM_HIGH = 4095;
const int PWM_LOW = 0;

int red1 = 19;
int red2 = 24;
int red3 = 28;

int ground1 = 22;
int ground2 = 25;
int ground3 = 29;

int green1 = 20;
int green2 = 26;
int green3 = 30;

int blue1 = 21;
int blue2 = 27;
int blue3 = 31;


void setup() {
  Serial.begin(9600);
  pinMode(2, OUTPUT);
  Tlc.init();
  Tlc.clear();
  // put your setup code here, to run once:
  
}

void loop() {
// put your main code here, to run repeatedly:
//  setPWMValue(ground1, PWM_HIGH);
//  setPWMValue(ground2, PWM_HIGH);
//  setPWMValue(ground3, PWM_LOW);
//  setPWMValue(red1, PWM_HIGH);
//  setPWMValue(green1, PWM_LOW);
  
  setPWMValue(14, 4095);
  setPWMValue(13, 0);
  digitalWrite(2, HIGH);
  
  delay(200);
  
  Tlc.update();
}

//set Tlc (pwm multiplexer) channel value. Note: changes won't take effect until Tlc.update() is called
void setPWMValue(int channel, int value) {
  //this thing is actually reverse
  Tlc.set(channel, PWM_HIGH-value);
}
