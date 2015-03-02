int _slider = A0;
int _touch = 7;
int _motor = 3;
int _dirDown = 2;
int _dirUp = 4;
int _ledR = 9;
int _ledG = 5;
int _ledB = 6;

int _posTop = 1000;
int _posBottom = 0;
int _posStop = 700;
int pos = 0;

int desiredPos = 0;
double kI = 0.2;
double kP = 0.2;
double kD = 0.2;
double Integral = 0;
double Derivative = 0;
double Last = 0;
double Error = 0;
double Actual = 0;
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
 // Serial.print(touchState);
 // Serial.print(',');
 // Serial.print(pos);
 // Serial.print('\n');
  
//*****************SERIAL INPUT BUFFER******************
  while (Serial.available() > 0)
  {
    if(index < 19) // One less than the size of the array
    {
      inChar = Serial.read(); // Read a character
      inData[index] = inChar; // Store it
      index++; // Increment where to write next
    }
  }
  if (Serial.available() == 0 && strlen(inData) != 0 && inData[index - 1] == 10) {
    inData[index - 1] = 0;
    
    if (inData[0] == 'R') {
      red = String(inData).substring(1,4).toInt();
    }
    if (inData[0] == 'G') {
      green = String(inData).substring(1,4).toInt();
    }
    if (inData[0] == 'B') {
      blue = String(inData).substring(1,4).toInt();
    }
    if (inData[0] == 'P') {
      desiredPos = String(inData).substring(1,5).toInt();
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
//******************************************************

/*
//*******************PID CONTROL LOOP*******************
  pos = map(analogRead(_slider),0,1023,_posBottom,_posTop);
  if (pos == _posTop) {
    motorDirectionDown = 1;
    motorSpeed = 150;
  }
  
  if (pos == _posBottom) {
    motorDirectionDown = 0;
    motorSpeed = 190;
  }
//******************************************************
*/
kP = 1;
kI = 0.02;
kD = 0.2;
desiredPos = 500;
//*******************Custom PID ************************
Actual = map(analogRead(_slider),0,1023,_posBottom,_posTop);
Error = desiredPos - Actual;

Integral = Integral + Error;

Derivative = Last - Actual;

Drive = (Error*kP) + (Integral*kI) + (Derivative*kD);
Serial.print(Drive,DEC);
Serial.print(" ");
Serial.println("A");
motorSpeed = abs(map(Drive,-500,500,-255,255));

if (Drive < 0){
  motorDirectionDown = 1;
}
else{
  motorDirectionDown = 0;
}

//motorDirectionDown = 0;
//motorSpeed = 255;

Last = Actual;
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


