int pot = A0;
int dir1 = 2;
int dir2 = 8;
int motor = 11;
int pos = 0;

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
}

void loop() {
  // put your main code here, to run repeatedly:
  pos = map(analogRead(pot),0,1023,0,1000);
  Serial.println(pos);

  if (pos == 1000) {
    motorDirection = 1;
    motorSpeed = 105;
  }
  
  if (pos == 0) {
    motorDirection = 0;
    motorSpeed = 130;
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
