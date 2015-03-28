const int _posTop = 1000;
const int _posBottom = 0;

const int PWM_HIGH = 255;
const int PWM_LOW = 0;

struct pixel {
  const int _dirDown;
  const int _dirUp;
  const int _motor;
  
  int actualPos;
  int lastPos;
  int action;

  pixel(int analogPos, int motor, int dirUp, int dirDown)
    : _dirDown(dirDown), _dirUp(dirUp), _motor(motor), _analogPos(analogPos)
    , actualPos(0), lastPos(0), action(0)
  {
    pinMode(_motor, OUTPUT);
    pinMode(_dirDown, OUTPUT);
    pinMode(_dirUp, OUTPUT);
    pinMode(_analogPos, INPUT);
  }

  void readPosition() {
    lastPos = actualPos;
    actualPos = map(analogRead(_analogPos),0,1023,_posBottom,_posTop);
    actualPos = constrain(actualPos, _posBottom, _posTop);
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
 {A10,5,32,35},
 {A7,12,37,33},
 {A15,8,27,24}, 
 {A9,3,30,31}, 
 {A8,11,34,36},
 {A12,6,23,22},  
 {A13,2,29,28},
 {A11,10,38,39},
 {A14,7,27,26}
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
