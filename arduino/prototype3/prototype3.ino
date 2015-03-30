//#include <CapacitiveSensor.h>

//variables used inside pixel
const int _posTop = 1000;
const int _posBottom = 0;
unsigned int _posStop = 300;
unsigned int _posFlush = 400;

unsigned int BUZZ_THRESHOLD = 0;
unsigned int MOTOR_MIN = 0;

const unsigned int PWM_HIGH = 255;
const unsigned int PWM_LOW = 0;

const unsigned int NUM_PRESETS = 3;
double presets[NUM_PRESETS][3] = {{0.6, 0.2, 0.02}, {10, 0.3, 0.02}, {0, 0, 0}};

unsigned int touchSwap = 100;

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
  int touchAwait;

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
    setColor(255, 0, 0);
    setTarget(1000);

    pinMode(_analogPos, INPUT);
    pinMode(_touchIn, INPUT);
    pinMode(_motor, OUTPUT);
    pinMode(_dirDown, OUTPUT);
    pinMode(_dirUp, OUTPUT);
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

  void flushTouchPin() {
    touchState = touchCount;
    touchCount = 0;
    pinMode(_touchIn, OUTPUT);
    digitalWrite(_touchIn, LOW);
    pinMode(_touchIn, INPUT);
  }

  void readTouchState() {
    if (digitalRead(_touchIn) == LOW) touchCount++;
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
  {A10, 48, 5, 32, 35, 4, A1, 9, 13}, //0
  {A7, 50, 12, 37, 33, 4, A0, 9, 13}, //1
  {A15, 41, 8, 27, 24, 45, A2, 44, 46}, //2
  {A9, 49, 3, 30, 31, 4, A3, 9, 13}, //3
  {A8, 51, 11, 34, 36, 4, A2, 9, 13}, //4
  {A12, 40, 6, 23, 22, 45, A4, 44, 46}, //5
  {A13, 43, 2, 29, 28, 45, A1, 44, 46}, //6
  {A11, 47, 10, 38, 39, 45, A3, 44, 46}, //7
  {A14, 42, 7, 27, 26, 45, A0, 44, 46} //8
};

const unsigned int BUFFER_SIZE = 20;
char inData[BUFFER_SIZE];

unsigned int index = 0;
unsigned int serialTimer = 0;
unsigned int STIMER_THRESHOLD = 100;

const unsigned int ledPairs[5][2] = {{1, 8}, {4, 2}, {3, 7}, {6, 0}, {5, 5}};
unsigned int ledCounter = 0;
unsigned int ledDelay = 8;
unsigned int currentPair = 0;

unsigned int pixelCounter = 0;
unsigned int pixelPrintCounter = 0;
String debugPixels = "111111111";

const unsigned int touchOut = 52;
unsigned int touchCounter = 0;

void setup() {
  Serial.begin(115200);

  pinMode(touchOut, OUTPUT);
  digitalWrite(touchOut, HIGH);

  //  startupAnimation();
  //timers for pwm
  /*TCCR1B = (TCCR1B & 0xF8) | 0x05;
  TCCR2B = (TCCR2B & 0xF8) | 0x07;
  TCCR3B = (TCCR3B & 0xF8) | 0x05;
  TCCR4B = (TCCR4B & 0xF8) | 0x05;*/
}

void loop() {

  pixelCounter++;
  if (pixelCounter == numPixels) pixelCounter = 0;
  if (debugPixels[pixelCounter] == '0') return;

  touchCounter++;
  if (touchCounter == touchSwap) {
    for (int i = 0; i < numPixels; i++)
      if (debugPixels[i] == '1') pixels[i].flushTouchPin();
    touchCounter = 0;
  };

  ledCounter++;
  if (ledCounter > (5 * ledDelay - 1)) ledCounter = 0;
  if (ledCounter % ledDelay == 0) writeLEDPair();

  for (int i = 0; i < 5; i++) {
    serialRead();
  }

  pixels[pixelCounter].readPosition();
  pixels[pixelCounter].readTouchState();

  pixels[pixelCounter].calculatePIDAction();
  pixels[pixelCounter].moveMotor();

  serialTimer++;
  if (serialTimer > STIMER_THRESHOLD) {
    while (debugPixels[pixelPrintCounter] == '0') {
      pixelPrintCounter++;
      if (pixelPrintCounter == numPixels) pixelPrintCounter = 0;
    }
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
      if (inData[1] == 'D') {
        debugPixels = String(inData).substring(2, 11);
        for (int i = 0; i < numPixels; i++) {
          if (debugPixels[i] == 0) {
            pixels[i].setTarget(_posStop);
            while (abs(pixels[i].actualPos - _posStop) > 50) {
              pixels[i].readPosition();
              pixels[i].calculatePIDAction();
              pixels[i].moveMotor();
            }
            pixels[i].action = 0;
            pixels[i].moveMotor();
          }
        }
      }

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

  pixels[0].setColor(0, 0, 255);
  pixels[1].setColor(0, 255, 0);
  pixels[2].setColor(0, 0, 255);
  pixels[3].setColor(0, 255, 0);
  pixels[4].setColor(255, 0, 0);
  pixels[5].setColor(0, 255, 0);
  pixels[6].setColor(0, 0, 255);
  pixels[7].setColor(0, 255, 0);
  pixels[8].setColor(0, 0, 255);

  delay(1000);

  for (int a = 0; a < 4; a++) {
    pixels[4].desiredPos += 100;
    delay(400);
  }

  for (int a = 0; a < 6; a++) {
    pixels[1].desiredPos += 100;
    pixels[3].desiredPos += 100;
    pixels[5].desiredPos += 100;
    pixels[7].desiredPos += 100;
    delay(300);
  }

  for (int a = 0; a < 8; a++) {
    pixels[0].desiredPos += 100;
    pixels[2].desiredPos += 100;
    pixels[6].desiredPos += 100;
    pixels[8].desiredPos += 100;
    delay(200);
  }

  delay(1000);

  pixels[0].setColor(255, 0, 0);
  pixels[1].setColor(0, 0, 255);
  pixels[2].setColor(255, 0, 0);
  pixels[3].setColor(0, 0, 255);
  pixels[4].setColor(0, 255, 0);
  pixels[5].setColor(0, 0, 255);
  pixels[6].setColor(255, 0, 0);
  pixels[7].setColor(0, 0, 255);
  pixels[8].setColor(255, 0, 0);

  while (pixels[4].desiredPos > _posFlush) {
    pixels[4].desiredPos -= 100;
    delay(400);
  }

  while (pixels[1].desiredPos > _posFlush) {
    pixels[1].desiredPos -= 100;
    pixels[3].desiredPos -= 100;
    pixels[5].desiredPos -= 100;
    pixels[7].desiredPos -= 100;
    delay(300);
  }

  while (pixels[0].desiredPos > _posFlush) {
    pixels[0].desiredPos -= 100;
    pixels[2].desiredPos -= 100;
    pixels[6].desiredPos -= 100;
    pixels[8].desiredPos -= 100;
    delay(200);
  }

}
