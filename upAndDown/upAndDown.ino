int pot = A0;
int dir1 = 2;
int dir2 = 8;
int motor = 11;
int pos = 0;
int touch = 7;
int touchVal = 0;
int touchValAvg = 0;
int touchCount = 0;

int motorEnabled = 1;
int motorDirection = 0;
int motorSpeed = 150;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  pinMode(pot, INPUT);
  pinMode(dir1, OUTPUT);
  pinMode(dir2, OUTPUT);
  pinMode(motor, OUTPUT);
  pinMode(touch,INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  pos = map(analogRead(pot),0,1023,0,1000);
  touchVal = digitalRead(touch);
 // Serial.println(pos);
 // Serial.println(touchVal);

//***********Buffer for touch input*******************
  
  if (touchCount == 10){
    
    //touchValAvg = touchValAvg/10;
    if (touchValAvg < 3){
      Serial.println("Touch");
      //Serial.println(touchValAvg);
    }
    
    touchValAvg = 0;
    touchCount = 0;
    
  }
  
  touchValAvg = touchVal + touchValAvg;
  
  touchCount = touchCount + 1;
  
  
//******************************************************
  if (pos == 1000) {
    motorDirection = 1;
    motorSpeed = 150;
  }
  
  if (pos == 0) {
    motorDirection = 0;
    motorSpeed = 190;
  }

  if (motorDirection == 1) {
    digitalWrite(dir1, HIGH);
    digitalWrite(dir2, LOW);
  } else {
    digitalWrite(dir1, LOW);
    digitalWrite(dir2, HIGH);
  }

  if (motorEnabled == 1) {
    analogWrite(motor, motorSpeed);
  } else {
    analogWrite(motor, 0);
  }

}
