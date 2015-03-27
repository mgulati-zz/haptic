//#include <CapacitiveSensor.h>

struct pixel {
  int dirDown;
  int dirUp;
  
  int ledR;
  int ledG;
  int ledB;
  int ledGround;
  int motor;
  int touchIn;
  
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
  int touchCount;
  
  int red;
  int blue;
  int green;
  
//  CapacitiveSensor touch;
};

const int numPixels = 9;
struct pixel pixels[numPixels];

const int BUFFER_SIZE = 20;
char inData[BUFFER_SIZE];

const int _posTop = 1000;
const int _posBottom = 0;

const int BUZZ_THRESHOLD = 10;
const int MOTOR_MIN = 180;

const int PWM_HIGH = 255;
const int PWM_LOW = 0;

int index = 0;
unsigned int serialTimer = 0;
const int STIMER_THRESHOLD = 20;

const int NUM_PRESETS = 2;
double presets[NUM_PRESETS][3] = {{0.6, 0.2, 0.02}, {10, 0.3, 0.02}};

int ledPairs[5][2] = {{0,4}, {2,3}, {1,7}, {6,8}, {5,5}};
int ledCounter = 0;

int pixelCounter = 0;
int debugPixel = 0;

void setup() {
  Serial.begin(115200);
  /*TCCR1B = (TCCR1B & 0xF8) | 0x05;
  TCCR2B = (TCCR2B & 0xF8) | 0x07;
  TCCR3B = (TCCR3B & 0xF8) | 0x05;
  TCCR4B = (TCCR4B & 0xF8) | 0x05;*/

  //Common initializations 
  for (int i = 0; i < numPixels; i++) {
    pixels[i].desiredPos = 600;
    pixels[i].integral = 0;
    pixels[i].derivative = 0;
    pixels[i].touchState = 0;
    pixels[i].touchCount = 0;
    pixels[i].kP = 1.5;
    pixels[i].kD = 0.2;
    pixels[i].kI = 0.02;
    pixels[i].red = 0;
    pixels[i].blue = 0;
    pixels[i].green = 255;
  }
  pixels[0].motor = 12;
  pixels[0].dirUp = 37;
  pixels[0].dirDown = 33;
  pixels[0].analogPos = A7;
  pixels[0].ledGround = A0;
  pixels[0].ledR = 4;
  pixels[0].ledG = 9;
  pixels[0].ledB = 13;
  
  pixels[1].motor = 3;
  pixels[1].dirDown = 31;
  pixels[1].dirUp = 30;
  pixels[1].analogPos = A9;
  pixels[1].ledGround = A3;
  pixels[1].ledR = 4;
  pixels[1].ledG = 9;
  pixels[1].ledB = 13;
  
  pixels[2].motor = 11;
  pixels[2].dirDown = 36;
  pixels[2].dirUp = 34;
  pixels[2].analogPos = A8;
  pixels[2].ledGround = A2;
  pixels[2].ledR = 4;
  pixels[2].ledG = 9;
  pixels[2].ledB = 13;

  //pixels[2].touchRead = 88;
  //pixels[2].touchSend = 88;
  //pixels[2].touch = CapacitiveSensor(pixel[0].touchRead,pixel[0].touchSend);
  
  pixels[3].motor = 8;
  pixels[3].dirUp = 27;
  pixels[3].dirDown = 24;
  pixels[3].analogPos = A15;
  pixels[3].ledGround = A2;
  pixels[3].ledR = 45;
  pixels[3].ledG = 44;
  pixels[3].ledB = 46;
 
  pixels[4].motor = 7;
  pixels[4].dirDown = 26;
  pixels[4].dirUp = 27;
  pixels[4].analogPos = A14;
  pixels[4].ledGround = A0;
  pixels[4].ledR = 45;
  pixels[4].ledG = 44;
  pixels[4].ledB = 46;
 
  pixels[5].motor = 6;
  pixels[5].dirUp = 23;
  pixels[5].dirDown = 22;
  pixels[5].analogPos = A12;
  pixels[5].ledGround = A4;
  pixels[5].ledR = 45;
  pixels[5].ledG = 44;
  pixels[5].ledB = 46;
  
  pixels[6].motor = 2;
  pixels[6].dirDown = 28;
  pixels[6].dirUp = 29;
  pixels[6].analogPos = A13;
  pixels[6].ledGround = A1;
  pixels[6].ledR = 45;
  pixels[6].ledG = 44;
  pixels[6].ledB = 46;
 
  pixels[7].motor = 10;
  pixels[7].dirDown = 39;
  pixels[7].dirUp = 38;
  pixels[7].analogPos = A11;
  pixels[7].ledGround = A3;
  pixels[7].ledR = 45;
  pixels[7].ledG = 44;
  pixels[7].ledB = 46;
  
  pixels[8].motor = 5;
  pixels[8].dirDown = 35;
  pixels[8].dirUp = 32;
  pixels[8].analogPos = A10;
  pixels[8].ledGround = A1;
  pixels[8].ledR = 4;
  pixels[8].ledG = 9;
  pixels[8].ledB = 13;
  
  for (int i = 0; i < numPixels; i++) {
    pinMode(pixels[i].motor, OUTPUT);
    pinMode(pixels[i].dirDown, OUTPUT);
    pinMode(pixels[i].dirUp, OUTPUT);
    pinMode(pixels[i].analogPos, INPUT);
    pinMode(pixels[i].ledGround, OUTPUT);
    pinMode(pixels[i].ledR, OUTPUT);
    pinMode(pixels[i].ledG, OUTPUT);
    pinMode(pixels[i].ledB, OUTPUT);
    //pinMode(pixels[i].touchRead, INPUT);
    //pinMode(pixels[i].touchSend, OUTPUT)
  }

}

void loop() {
  serialRead();
  
  ledCounter++;
  if (ledCounter > 5*3) ledCounter = 0;
  writeLEDPair();
  
  readPosition(pixelCounter);
  readTouchState(pixelCounter);
  
  int action = calculatePIDAction(pixelCounter);
  moveMotor(pixelCounter, action);
  
  pixelCounter++;
  if (pixelCounter == numPixels) pixelCounter = 0;

  serialTimer++;
  if (serialTimer > STIMER_THRESHOLD) {
//    Serial.print(action);
//    Serial.print(",");
    serialPrintPixel(debugPixel);
    serialTimer = 0;
  }
}

void serialPrintPixel(int i) {
    Serial.print(i);
    Serial.print(",");
    Serial.print(pixels[i].touchState);
    Serial.print(",");
    Serial.print(pixels[i].actualPos);
    Serial.print(",");
    Serial.print(pixels[i].desiredPos);
    Serial.println("");
}

//read current position of slider and update its respective stored value
void readPosition(int pixel) {
  pixels[pixel].actualPos = map(analogRead(pixels[pixel].analogPos),0,1023,_posBottom,_posTop);
  pixels[pixel].actualPos = constrain(pixels[pixel].actualPos, _posBottom, _posTop);
}

void readTouchState(int pixel) {
  //NOT TESTED, NEEDS FURTHER IMPLEMENTATION
  if (digitalRead(pixels[pixel].touchIn) == HIGH) {
    pixels[pixel].touchCount += 1;
    if (pixels[pixel].touchCount > 50) {
      pixels[pixel].touchState = 1;
    }
  } else {
    pixels[pixel].touchCount = 0;
    pixels[pixel].touchState = 0;
  }
  
 /* long total1 = pixels[pixel].touch.capacitiveSensor(30);
  
  if (total1 > calibratedThreshold){
    touchState = 1;
  }
  else
    touchState = 0;  
  */
  
}

//returns a motor speed, all pid controls
int calculatePIDAction(int pixel) {
  //if (pixels[channel].touchState == 1 && pixels[channel].allowSlide == 1) pixels[channel].desiredPos = pixels[channel].actualPos;
 
  int error = pixels[pixel].desiredPos - pixels[pixel].actualPos;
  
  pixels[pixel].integral = constrain((pixels[pixel].integral + error), -20000, 20000);
  
  if (pixels[pixel].derivative == 0 && error == 0) {
    pixels[pixel].integral = 0;
  }
    
//  if (pixels[pixel].integral > PWM_HIGH) pixels[pixel].integral = PWM_HIGH;
//  if (pixels[pixel].integral < -PWM_HIGH) pixels[pixel].integral = -PWM_HIGH;

  pixels[pixel].derivative = pixels[pixel].lastPos - pixels[pixel].actualPos;
  pixels[pixel].lastPos = pixels[pixel].actualPos;
  
  //taken out integral acction for now )
  double drive = (error*pixels[pixel].kP) + (pixels[pixel].integral*pixels[pixel].kI) + (pixels[pixel].derivative*pixels[pixel].kD);
  
  int motorSpeed = constrain(map(drive,-500, 500, -PWM_HIGH, PWM_HIGH), -PWM_HIGH,  PWM_HIGH);
  if (abs(motorSpeed) < BUZZ_THRESHOLD) {
    motorSpeed = PWM_LOW;
  }
 
  return motorSpeed;
}

void setPWMValue(int channel, int value) {
  analogWrite(channel, value);
}

void setDirection(int pixel, int action) {
  if (action > 0) {
     digitalWrite(pixels[pixel].dirUp, HIGH);    
     digitalWrite(pixels[pixel].dirDown, LOW);
  } else {
    digitalWrite(pixels[pixel].dirUp, LOW);
    digitalWrite(pixels[pixel].dirDown, HIGH); 
  }
}

void setPWMPreset(int i, int preset) {
  pixels[i].kP = presets[preset][0];
  pixels[i].kD = presets[preset][1];
  pixels[i].kI = presets[preset][2];
}

void moveMotor(int pixel, int action) {
  setDirection(pixel, action);
  int pwmWrite = map(abs(action),PWM_LOW, PWM_HIGH, MOTOR_MIN, PWM_HIGH);
  if (action == PWM_LOW) pwmWrite = PWM_LOW;
  setPWMValue(pixels[pixel].motor, pwmWrite);
}

void writeLEDPair() {
  int pair = ledCounter/3;
  if (ledCounter % 3 == 0) {
    for (int i = 0; i < 5; i++) {
       digitalWrite(pixels[ledPairs[i][0]].ledGround, HIGH);
    }
  }
  for (int i = 0; i < 2; i++) {
    int id = ledPairs[pair][i];
    analogWrite(pixels[id].ledR, pixels[id].red);
    analogWrite(pixels[id].ledG, pixels[id].green);
    analogWrite(pixels[id].ledB, pixels[id].blue);
  }
  digitalWrite(pixels[ledPairs[pair][0]].ledGround, LOW);
}

//read one command from serial interface and react accordingly
void serialRead() {
  while (Serial.available() > 0 && Serial.peek() != 10)
  {
    if(index > BUFFER_SIZE - 1) index = 0;// One less than the size of the array
    inData[index] = Serial.read(); // Read a character, store it
    index++; // Increment where to write next
  }
  
  if (strlen(inData) != 0 && Serial.peek() == 10) {
    Serial.read();
    int id = String(inData).substring(0,1).toInt();
    if (id <= numPixels - 1) {
      if (inData[1] == 'C') {
        pixels[id].red = constrain(String(inData).substring(2,5).toInt(),0,255);
        pixels[id].green = constrain(String(inData).substring(5,8).toInt(),0,255);
        pixels[id].blue = constrain(String(inData).substring(8,11).toInt(),0,255);
      }
      
      if (inData[1] == 'P') {
        pixels[id].desiredPos = constrain(map(String(inData).substring(2,6).toInt(), 0, 1000, 600, 1000),600,1000);
      }
      
      if (inData[1] == 'A') {
        pixels[id].allowSlide = constrain(String(inData).substring(2,3).toInt(),0,1);
      }
      
      if (inData[1] == 'S') {
        setPWMPreset(id, constrain(String(inData).substring(2,3).toInt(),0, NUM_PRESETS));
      }
      
      if (inData[1] == 'D') {
        debugPixel = id;
      }
    }
    
    for (int i=0;i<BUFFER_SIZE;i++) {
      inData[i]=0;
    }
    index = 0;
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
