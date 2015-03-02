int _slider = A0;
int _touch = 7;
int _motor = 3;
int _dirDown = 2;
int _dirUp = 4;
int _ledR = 5;
int _ledG = 9;
int _ledB = 6;

int _posTop = 1000;
int _posBottom = 0;
int _posStop = 700;
int actualPos = 0;
int desiredPos = 0;
double lastPos = 0;
double slideSpeed = 0;

double kI = 0.02;
double kP = 0.5;
double kD = 0.2;
double Error = 0;
double Integral = 0;
int Drive = 0;

int touchState = 0;
int touchVal = 0;
int touchValAvg = 0;
int touchCount = 0;

int _motorSpeedLow;
int _motorSpeedHigh;
int _motorSpeedUpvDown;
int motorSpeed = 150;
int motorEnabled = 1;
int motorDirectionDown = 0;

int red = 0;
int green = 0;
int blue = 0;

char inData[20]; // Allocate some space for the string
char inChar=-1; // Where to store the character read
byte index = 0; // Index into array; where to store the character

void setup() {
  Serial.begin(9600);
  
  pinMode(_slider, INPUT); //analog in
  pinMode(_touch,INPUT); //digital in
  pinMode(_motor, OUTPUT); //pwm
  pinMode(_dirDown, OUTPUT); //digital out
  pinMode(_dirUp, OUTPUT); //digital out
  pinMode(_ledR, OUTPUT); //pwm
  pinMode(_ledG, OUTPUT); //pwm
  pinMode(_ledB, OUTPUT); //pwm
}

void loop() { 
  Serial.print(touchState);
  Serial.print(',');
  Serial.print(actualPos);
  Serial.print(',');
  Serial.print(desiredPos);
  Serial.print('\n');
  
//*****************SERIAL INPUT BUFFER******************
  while (Serial.available() > 0 && Serial.peek() != 10)
  {
    if(index > 19) index = 0;// One less than the size of the array
    inChar = Serial.read(); // Read a character
    inData[index] = inChar; // Store it
    index++; // Increment where to write next
  }
  
  if (strlen(inData) != 0 && Serial.peek() == 10) {
    Serial.read();
    
    if (inData[0] == 'C') {
      red = constrain(String(inData).substring(1,4).toInt(),0,255);
      green = constrain(String(inData).substring(4,7).toInt(),0,255);
      blue = constrain(String(inData).substring(7,10).toInt(),0,255);
    }
    
    if (inData[0] == 'P') {
      desiredPos = constrain(String(inData).substring(1,5).toInt(),0,1000);
    }
        
    for (int i=0;i<19;i++) {
      inData[i]=0;
    }
    index = 0;
  }
//******************************************************

//*****************TOUCH INPUT BUFFER*******************
  if (touchCount == 10){
    if (touchValAvg < 3){
      touchState = 1;
    } else {
      touchState = 0;
    }
    touchValAvg = 0;
    touchCount = 0;
  }
  
  touchVal = digitalRead(_touch);
  touchValAvg = touchVal + touchValAvg;
  touchCount = touchCount + 1;
//********************************************************

/*
//*********************AKE CONTROL LOOP*******************
  actualPos = map(analogRead(_slider),0,1023,_posBottom,_posTop);
  if (actualPos > _posTop - 10) {
    motorDirectionDown = 1;
    motorSpeed = 255;
  }
  
  if (actualPos < _posBottom + 10) {
    motorDirectionDown = 0;
    motorSpeed = 255;
  }
//******************************************************
*/

//*******************CUSTOM PID ************************
actualPos = map(analogRead(_slider),0,1023,_posBottom,_posTop);
actualPos = constrain(actualPos, _posBottom, _posTop);

Error = desiredPos - actualPos;
Integral = Integral + Error;

if (touchState == 1){
  Error = 0;
  Integral = 0;
  desiredPos = actualPos;
}

slideSpeed = lastPos - actualPos;

Drive = (Error*kP) + (Integral*kI) + (slideSpeed*kD);
motorSpeed = constrain(abs(map(Drive,-500,500,-255,255)),0,255);

if (Drive < 0){
  motorDirectionDown = 1;
}
else{
  motorDirectionDown = 0;
}

lastPos = actualPos;
//******************************************************

//*******************WRITE TO MOTOR*********************
  if (motorDirectionDown == 1) {
    digitalWrite(_dirDown, HIGH);
    digitalWrite(_dirUp, LOW);
  } else {
    digitalWrite(_dirDown, LOW);
    digitalWrite(_dirUp, HIGH);
  }

  if (motorEnabled == 1) {
    analogWrite(_motor, motorSpeed);
  } else {
    analogWrite(_motor, 0);
  }
//******************************************************

//********************WRITE TO LEDS*********************
  analogWrite(_ledR, red);
  analogWrite(_ledB, blue);
  analogWrite(_ledG, green);
//******************************************************
}


