

int red1 = 2;
int red2 = 6;
int red3 = 10;

int ground1 = 3;
int ground2 = 7;
int ground3 = 11;

int green1 = 4;
int green2 = 8;
int green3 = 12;

int blue1 = 5;
int blue2 = 9;
int blue3 = 13;

int index = 1;

void setup() {
  pinMode(red1, OUTPUT);
  pinMode(red2, OUTPUT);
  pinMode(red3, OUTPUT);
  pinMode(ground1, OUTPUT);
  pinMode(ground2, OUTPUT);
  pinMode(ground3, OUTPUT);
  pinMode(green1, OUTPUT);
  pinMode(green2, OUTPUT);
  pinMode(green3, OUTPUT);
  pinMode(blue1, OUTPUT);
  pinMode(blue2, OUTPUT);
  pinMode(blue3, OUTPUT);
}


void loop() {
  if (index == 4) index = 1;
  
  if (index == 1) {
    digitalWrite(ground2, HIGH);
    digitalWrite(ground3, HIGH);
    digitalWrite(red2, LOW);
    digitalWrite(red3, LOW);
    digitalWrite(green1, LOW);
    digitalWrite(green3, LOW);
    digitalWrite(blue1, LOW);
    digitalWrite(blue2, LOW);
    digitalWrite(ground1, LOW);
    analogWrite(red1, 100);
    analogWrite(green2, 150);
    analogWrite(blue3, 150);
  }
  if (index == 2) {
    digitalWrite(ground1, HIGH);
    digitalWrite(ground3, HIGH);
    digitalWrite(red1, LOW);
    digitalWrite(red3, LOW);
    digitalWrite(green1, LOW);
    digitalWrite(green2, LOW);
    digitalWrite(blue3, LOW);
    digitalWrite(blue2, LOW);
    digitalWrite(ground2, LOW);
    analogWrite(red2, 100);
    analogWrite(green3, 150);
    analogWrite(blue1, 150);
  }
  if (index == 3) {
    digitalWrite(ground2, HIGH);
    digitalWrite(ground1, HIGH);
    digitalWrite(red2, LOW);
    digitalWrite(red1, LOW);
    digitalWrite(green2, LOW);
    digitalWrite(green3, LOW);
    digitalWrite(blue1, LOW);
    digitalWrite(blue3, LOW);
    digitalWrite(ground3, LOW);
    analogWrite(red3, 100);
    analogWrite(green1, 150);
    analogWrite(blue2, 150);
  }
  delay(3);
  index++;
}
