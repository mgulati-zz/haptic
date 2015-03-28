const int _posTop = 1000;
const int _posBottom = 0;

const int BUZZ_THRESHOLD = 0;
const int MOTOR_MIN = 0;

const int PWM_HIGH = 255;
const int PWM_LOW = 0;

const int NUM_PRESETS = 2;
double presets[NUM_PRESETS][3] = {{0.6, 0.2, 0.02}, {10, 0.3, 0.02}};

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
    setColor(0,0,0);
    setTarget(0);

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
    setPIDValues(presets[preset][0],presets[preset][1],presets[preset][2]);
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
    actualPos = map(analogRead(_analogPos),0,1023,_posBottom,_posTop);
    actualPos = constrain(actualPos, _posBottom, _posTop);
  }

  void readTouchState() {
  //NOT TESTED, NEEDS FURTHER IMPLEMENTATION
    if (digitalRead(_touchIn) == HIGH) {
      touchCount += 1;
      if (touchCount > 50) {
        touchState = 1;
      }
    } else {
      touchCount = 0;
      touchState = 0;
    }
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
    analogWrite(_motor, abs(action));
  }

  void serialPrintPixel() {
    Serial.print(touchState);
    Serial.print(",");
    Serial.print(actualPos);
    Serial.print(",");
    Serial.print(desiredPos);
  }
  
};


const int numPixels = 9;
// {analogPos, touchIn, motor, dirUp, dirDown, ledR, ledGround, ledG, ledB}
pixel pixels[numPixels] = {
 {A10,52,5,32,35,4,A1,9,13},
 {A7,52,12,37,33,4,A0,9,13},
 {A15,52,8,27,24,45,A2,44,46}, 
 {A9,52,3,30,31,4,A3,9,13}, 
 {A8,52,11,34,36,4,A2,9,13},
 {A12,52,6,23,22,45,A4,44,46},  
 {A13,52,2,29,28,45,A1,44,46},
 {A11,52,10,38,39,45,A3,44,46},
 {A14,52,7,27,26,45,A0,44,46}
};

void setup() {
  Serial.begin(115200);
  
}

int testAction = -255;
int testPixel = 0;

void loop() {
  
  //just loops
  if (testAction > 255) {
    testPixel ++;
    testAction = -255;
  }
  if (testPixel == 2) testPixel ++;
  if (testPixel == 5) return;
  
  //get to the opposite end
  if (testAction > 0) pixels[testPixel].action = -255;
  if (testAction < 0) pixels[testPixel].action = 255;
  pixels[testPixel].moveMotor();
  delay(1000);
  
  //let it settle
  pixels[testPixel].action = 0;
  pixels[testPixel].moveMotor();
  delay(100);
  
  //starting values
  pixels[testPixel].readPosition();
  int startPoint = pixels[testPixel].actualPos;
  long startTime = millis();
  
  //test it out
  pixels[testPixel].action = testAction;
  pixels[testPixel].moveMotor();
  
  if (testAction > 0) {
    while (pixels[testPixel].actualPos < 850 && ((millis()-startTime) < 2000)) {
      pixels[testPixel].readPosition();
    }
  }
  
  if (testAction < 0) {
    while (pixels[testPixel].actualPos > 350 && ((millis()-startTime) < 2000)) {
      pixels[testPixel].readPosition();
    }
  }
  
  long endTime = millis();
  int endPoint = pixels[testPixel].actualPos;
  
  long duration = endTime - startTime;
  int distance = endPoint - startPoint;
  
  Serial.print(testPixel);
  Serial.print(" ");
  Serial.print(pixels[testPixel].actualPos);
  Serial.print(" ");
  Serial.print(testAction);
  Serial.print(" ");
  Serial.print(duration);
  Serial.print(" ");
  Serial.println(distance);
  
  pixels[testPixel].action = 0;
  pixels[testPixel].moveMotor();
  testAction += 10;
  
}
