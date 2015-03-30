//#include <CapacitiveSensor.h>

//variables used inside pixel
const int _posTop = 1000;
const int _posBottom = 0;

const int BUZZ_THRESHOLD = 0;
const int MOTOR_MIN = 0;

const int PWM_HIGH = 255;
const int PWM_LOW = 0;

const int NUM_PRESETS = 3;
double presets[NUM_PRESETS][3] = {{0.6, 0.2, 0.02}, {10, 0.3, 0.02}, {0, 0, 0}};

const int touchOut = 52;
const int touchMax = 100;

struct pixel {
  const int _ledR;
  const int _ledG;
  const int _ledB;
  const int _ledGround;
  const int _dirDown;
  const int _dirUp;
  const int _motor;
  const int _touchIn;
  const int _analogPos;

  int actualPos;
  int desiredPos;
  int lastPos;
  double kI;
  double kP;
  double kD;
  int integral;
  int allowSlide;
  int action;

  int touchState;
  int touchCount;
  int touchTemp;

  int red;
  int green;
  int blue;

  pixel(int analogPos, int touchIn, int motor, int dirUp, int dirDown, int ledR, int ledGround, int ledG, int ledB)
    : _ledR(ledR), _ledG(ledG), _ledB(ledB), _ledGround(ledGround)
    , _dirDown(dirDown), _dirUp(dirUp), _motor(motor)
    , _touchIn(touchIn), _analogPos(analogPos)
    , actualPos(0), lastPos(0), action(0)
    , integral(0), allowSlide(0)
    , touchState(0), touchCount(0)
  {
    setPIDPreset(0);
    setColor(0, 0, 0);
    setTarget(1000);

    pinMode(_motor, OUTPUT);
    pinMode(_dirDown, OUTPUT);
    pinMode(_dirUp, OUTPUT);
    pinMode(_analogPos, INPUT);
    pinMode(_ledGround, OUTPUT);
    pinMode(_ledR, OUTPUT);
    pinMode(_ledG, OUTPUT);
    pinMode(_ledB, OUTPUT);
  }

  void setPIDPreset(int preset) {
    setPIDValues(presets[preset][0], presets[preset][1], presets[preset][2]);
  }

  void setPIDValues(double p, double i, double d) {
    kP = p;
    kI = i;
    kD = d;
  }

  void setColor(int R, int G, int B) {
    red = R;
    green = G;
    blue = B;
  }

  void setTarget(int target) {
    desiredPos = target;
  }

  void readPosition() {
    lastPos = actualPos;
    actualPos = map(analogRead(_analogPos), 0, 1023, _posBottom, _posTop);
    actualPos = constrain(actualPos, _posBottom, _posTop);
  }

  void readTouchState() {  
    //touchState = digitalRead(_touchIn);
//    if (digitalRead(_touchIn) == HIGH) {
//      touchCount += 1;
//      if (touchCount > 50) {
//        touchState = 1;
//      }
//    } else {
//      touchCount = 0;
//      touchState = 0;
//    }
    if (touchCount > touchMax){
      touchCount = 0;
      pinMode(_touchIn,OUTPUT);
      digitalWrite(_touchIn,HIGH);
    }

    pinMode(_touchIn,INPUT);
    touchTemp = digitalRead(_touchIn);

    if (touchTemp == 1){
      touchState = touchCount; 
    }

    touchCount++;


  }

  void calculatePIDAction() {
    //if (touchState == 1 && allowSlide == 1) desiredPos = actualPos;
    int error = desiredPos - actualPos;
    int derivative = lastPos - actualPos;

    integral = constrain((integral + error), -20000, 20000);
    if (derivative == 0 && error == 0) integral = 0;

    action = (error * kP) + (integral * kI) + (derivative * kD);
    action = constrain(map(action, -500, 500, -PWM_HIGH, PWM_HIGH), -PWM_HIGH,  PWM_HIGH);
    if (abs(action) < BUZZ_THRESHOLD) action = PWM_LOW;
  }

  void setDirection() {
    if (action > 0) {
      digitalWrite(_dirUp, HIGH);
      digitalWrite(_dirDown, LOW);
    } else {
      digitalWrite(_dirUp, LOW);
      digitalWrite(_dirDown, HIGH);
    }
  }

  void moveMotor() {
    setDirection();
    int pwmWrite = map(abs(action), PWM_LOW, PWM_HIGH, MOTOR_MIN, PWM_HIGH);
    if (action == PWM_LOW) pwmWrite = PWM_LOW;
    analogWrite(_motor, pwmWrite);
  }

  void serialPrintPixel(int prependId) {
    Serial.print(prependId);
    Serial.print(",");
    Serial.print(touchState);
    Serial.print(",");
    Serial.print(actualPos);
    Serial.print(",");
    Serial.print(lastPos);
    Serial.print(",");
    Serial.print(desiredPos);
    Serial.print(",");
    Serial.print(action);
    Serial.println("");
  }

  double speedAtPWM(int testAction) {
    double t_kP = kP;
    double t_kI = kI;
    double t_kD = kD;
    setPIDPreset(2);

    //move to opposite end
    if (testAction > 0) action = -255;
    if (testAction < 0) action = 255;
    moveMotor();
    delay(1000);

    //let it settle
    action = 0;
    moveMotor();
    delay(100);

    //starting values
    readPosition();
    int startPoint = actualPos;
    long startTime = millis();

    if (testAction > 0) {
      while (actualPos < 850 && ((millis() - startTime) < 2000)) {
        readPosition();
      }
    }
    if (testAction < 0) {
      while (actualPos > 350 && ((millis() - startTime) < 2000)) {
        readPosition();
      }
    }

    long endTime = millis();
    int endPoint = actualPos;

    long duration = endTime - startTime;
    int distance = endPoint - startPoint;
    double speed = distance / duration;

    setPIDValues(t_kP, t_kI, t_kD);
    return speed;
  }

};

const int numPixels = 9;
// {analogPos, touchIn, motor, dirUp, dirDown, ledR, ledGround, ledG, ledB}
pixel pixels[numPixels] = {
  {A10, 48, 5, 32, 35, 4, A1, 9, 13},
  {A7, 50, 12, 37, 33, 4, A0, 9, 13},
  {A15, 41, 8, 27, 24, 45, A2, 44, 46},
  {A9, 49, 3, 30, 31, 4, A3, 9, 13},
  {A8, 51, 11, 34, 36, 4, A2, 9, 13},
  {A12, 40, 6, 23, 22, 45, A4, 44, 46},
  {A13, 43, 2, 29, 28, 45, A1, 44, 46},
  {A11, 47, 10, 38, 39, 45, A3, 44, 46},
  {A14, 42, 7, 27, 26, 45, A0, 44, 46}
};

const int BUFFER_SIZE = 20;
char inData[BUFFER_SIZE];

int index = 0;
unsigned int serialTimer = 0;
int STIMER_THRESHOLD = 20;

int ledPairs[5][2] = {{1, 8}, {4, 2}, {3, 7}, {6, 0}, {5, 5}};
unsigned int ledCounter = 0; 
int ledDelay = 8;
int currentPair = 0;

int pixelCounter = 0;
int pixelPrintCounter = 0;
String debugPixels = "111111111";

int touchCounter = 0;
int touchSwap = 1000;

int stepCounter = 0;
int stepLimit = 100;

void setup() {
  Serial.begin(115200);
  
  pinMode(touchOut, OUTPUT);
  
  pixels[5].setColor(255,0,0);
  pixels[3].setColor(255,0,0);
  pixels[7].setColor(0,255,0);
  pixels[6].setColor(255,80,0);
  pixels[8].setColor(255,20,0);
  pixels[2].setColor(255,0,0);

  startupAnimation();
  //timers for pwm
  /*TCCR1B = (TCCR1B & 0xF8) | 0x05;
  TCCR2B = (TCCR2B & 0xF8) | 0x07;
  TCCR3B = (TCCR3B & 0xF8) | 0x05;
  TCCR4B = (TCCR4B & 0xF8) | 0x05;*/
}

void loop() {
  for (int i = 0; i < 5; i++) {
    serialRead();
  }
  
  stepCounter++;
  //counterclockwise snake
  if (stepCounter == stepLimit) {
    int tempRed = pixels[5].red;
    int tempGreen = pixels[5].green;
    int tempBlue = pixels[5].blue;
    pixels[5].setColor(pixels[3].red, pixels[3].green, pixels[3].blue);
    pixels[3].setColor(pixels[7].red, pixels[7].green, pixels[7].blue);
    pixels[7].setColor(pixels[6].red, pixels[6].green, pixels[6].blue);
    pixels[6].setColor(pixels[8].red, pixels[8].green, pixels[8].blue);
    pixels[8].setColor(pixels[2].red, pixels[2].green, pixels[2].blue);
    pixels[2].setColor(tempRed, tempGreen, tempBlue);
    stepCounter = 0;
  }
  
  ledCounter++;
  if (ledCounter > (5 * ledDelay - 1)) ledCounter = 0;
  if (ledCounter % ledDelay == 0) writeLEDPair();
  
  /*touchCounter++;
  if (touchCounter == touchSwap/2) 
    digitalWrite(touchOut, HIGH);
  else if (touchCounter == touchSwap) {
    digitalWrite(touchOut, LOW);
    touchCounter = 0;
  }*/

  pixelCounter++;
  if (pixelCounter == numPixels) pixelCounter = 0;

  pixels[pixelCounter].readPosition();
  pixels[pixelCounter].readTouchState();

  pixels[pixelCounter].calculatePIDAction();
  pixels[pixelCounter].moveMotor();

  serialTimer++;
  if (serialTimer > STIMER_THRESHOLD) {
    if (debugPixels[pixelPrintCounter] == '1')
      pixels[pixelPrintCounter].serialPrintPixel(pixelPrintCounter);
    serialTimer = 0;
    pixelPrintCounter++;
    if (pixelPrintCounter == numPixels) pixelPrintCounter = 0;
  }
}

void writeLEDPair() {
  digitalWrite(pixels[ledPairs[currentPair][0]]._ledGround, HIGH);
  currentPair = ledCounter / ledDelay;
  for (int i = 0; i < 2; i++) {
    int id = ledPairs[currentPair][i];
    analogWrite(pixels[id]._ledR, pixels[id].red);
    analogWrite(pixels[id]._ledG, pixels[id].green);
    analogWrite(pixels[id]._ledB, pixels[id].blue);
  }
  digitalWrite(pixels[ledPairs[currentPair][0]]._ledGround, LOW);
}

//read one command from serial interface and react accordingly
void serialRead() {
  while (Serial.available() > 0 && Serial.peek() != 10)
  {
    if (index > BUFFER_SIZE - 1) index = 0; // One less than the size of the array
    inData[index] = Serial.read(); // Read a character, store it
    index++; // Increment where to write next
  }

  if (strlen(inData) != 0 && Serial.peek() == 10) {
    Serial.read();
    int id = String(inData).substring(0, 1).toInt();
    if (id <= numPixels - 1) {

      //Set color, #C255000255
      if (inData[1] == 'C') {
        pixels[id].red = constrain(String(inData).substring(2, 5).toInt(), 0, 255);
        pixels[id].green = constrain(String(inData).substring(5, 8).toInt(), 0, 255);
        pixels[id].blue = constrain(String(inData).substring(8, 11).toInt(), 0, 255);
      }

      //set desired position #P1000
      if (inData[1] == 'P') pixels[id].setTarget(map(constrain(String(inData).substring(2, 6).toInt(), 0, 1000), 0, 1000, 300, 1000));

      //set allowsliding on capacitive touch #A1
      if (inData[1] == 'A') pixels[id].allowSlide = constrain(String(inData).substring(2, 3).toInt(), 0, 1);

      //pid presets #S2
      if (inData[1] == 'S') pixels[id].setPIDPreset(constrain(String(inData).substring(2, 3).toInt(), 0, NUM_PRESETS));

      //test pixel at speed and print result, #T255,
      if (inData[1] == 'T') {
        int testSpeed = constrain(String(inData).substring(2, 6).toInt(), -255, 255);
        Serial.print("T,");
        Serial.print(id);
        Serial.print(',');
        Serial.print(testSpeed);
        Serial.print(',');
        Serial.println(pixels[id].speedAtPWM(testSpeed));
      }

    } else {
      //set debug pixel, not currently used, #D
      if (inData[1] == 'D') debugPixels = String(inData).substring(2, 11);
      
      //change led Delay
      if (inData[1] == 'L') ledDelay = (constrain(String(inData).substring(2, 6).toInt(), 1, 9999));
      
      //change serial treshold
      if (inData[1] == 'S') STIMER_THRESHOLD = (constrain(String(inData).substring(2, 6).toInt(), 1, 9999));
    }

    for (int i = 0; i < BUFFER_SIZE; i++) {
      inData[i] = 0;
    }

    index = 0;
  }
}

void startupAnimation() {
  pixels[0].desiredPos = 200;
  pixels[1].desiredPos = 400;
  pixels[2].desiredPos = 200;
  pixels[3].desiredPos = 400;
  pixels[4].desiredPos = 600;
  pixels[5].desiredPos = 400;
  pixels[6].desiredPos = 200;
  pixels[7].desiredPos = 400;
  pixels[8].desiredPos = 200;

  pixels[0].setColor(0,0,255);
  pixels[1].setColor(0,255,0);
  pixels[2].setColor(0,0,255);
  pixels[3].setColor(0,255,0);
  pixels[4].setColor(255,0,0);
  pixels[5].setColor(0,255,0);
  pixels[6].setColor(0,0,255);
  pixels[7].setColor(0,255,0);
  pixels[8].setColor(0,0,255);

  delay(1000);

  for (int a=0; a<4; a++) {
    pixels[4].desiredPos += 100;
    delay(500);
  }

  for (int a=0; a<6; a++) {
    pixels[1].desiredPos += 100;
    pixels[3].desiredPos += 100;
    pixels[5].desiredPos += 100;
    pixels[7].desiredPos += 100;
    delay(400);
  }

  for (int a=0; a<8; a++) {
    pixels[0].desiredPos += 100;
    pixels[2].desiredPos += 100;
    pixels[6].desiredPos += 100;
    pixels[8].desiredPos += 100;
    delay(300);
  }

  delay(1000);

  pixels[0].setColor(255,0,0);
  pixels[1].setColor(0,0,255);
  pixels[2].setColor(255,0,0);
  pixels[3].setColor(0,0,255);
  pixels[4].setColor(0,255,0);
  pixels[5].setColor(0,0,255);
  pixels[6].setColor(255,0,0);
  pixels[7].setColor(0,0,255);
  pixels[8].setColor(255,0,0);

  for (int a=0; a<10; a++) {
    pixels[4].desiredPos -= 100;
    delay(500);
  }

  for (int a=0; a<10; a++) {
    pixels[1].desiredPos -= 100;
    pixels[3].desiredPos -= 100;
    pixels[5].desiredPos -= 100;
    pixels[7].desiredPos -= 100;
    delay(400);
  }

  for (int a=0; a<10; a++) {
    pixels[0].desiredPos -= 100;
    pixels[2].desiredPos -= 100;
    pixels[6].desiredPos -= 100;
    pixels[8].desiredPos -= 100;
    delay(300);
  }

}
