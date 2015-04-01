

int red1 = 45;
int red2 = 4;

int green1 = 44;
int green2 = 9;

int blue1 = 46;
int blue2 = 13;

int ground1 = A0;
int ground2 = A1;
int ground3 = A2;
int ground4 = A3;
int ground5 = A4;

int index = 1;

void setup() {
  pinMode(red1, OUTPUT);
  pinMode(red2, OUTPUT);
  pinMode(ground1, OUTPUT);
  pinMode(ground2, OUTPUT);
  pinMode(ground3, OUTPUT);
  pinMode(ground4, OUTPUT);
  pinMode(ground5, OUTPUT);
  pinMode(green1, OUTPUT);
  pinMode(green2, OUTPUT);
  pinMode(blue1, OUTPUT);
  pinMode(blue2, OUTPUT);

  // analogWrite(red1, 255);
  // analogWrite(green1, 0);
  // analogWrite(blue1, 0);
  // analogWrite(red2, 0);
  // analogWrite(green2, 255);
  // analogWrite(blue2, 0);
}


void loop() {
  if (index == 6) index = 1;
  
  if (index == 1) {
    digitalWrite(ground2,HIGH);
    digitalWrite(ground3,HIGH);
    digitalWrite(ground4,HIGH);
    digitalWrite(ground5,HIGH);   
    
    //Write block

    analogWrite(red1, 255);
    analogWrite(green1, 0);
    analogWrite(blue1,0);
    analogWrite(red2, 255);
    analogWrite(green2, 0);
    analogWrite(blue2, 0);
    digitalWrite(ground1,LOW);
    
  }
  if (index == 2) {
    digitalWrite(ground1,HIGH);
    digitalWrite(ground3,HIGH);
    digitalWrite(ground4,HIGH);
    digitalWrite(ground5,HIGH);   
    
    //Write block
    analogWrite(red1, 0);
    analogWrite(green1, 255);
    analogWrite(blue1,0);
    analogWrite(red2, 0);
    analogWrite(green2, 255);
    analogWrite(blue2, 0);
    digitalWrite(ground2,LOW);
  }
  if (index == 3) {
    digitalWrite(ground2,HIGH);
    digitalWrite(ground1,HIGH);
    digitalWrite(ground4,HIGH);
    digitalWrite(ground5,HIGH);   
    
    //Write block
    analogWrite(red1, 0);
    analogWrite(green1, 0);
    analogWrite(blue1,255);
    analogWrite(red2, 0);
    analogWrite(green2, 0);
    analogWrite(blue2, 255);
    digitalWrite(ground3,LOW);
  }
  if (index == 4){
    digitalWrite(ground2,HIGH);
    digitalWrite(ground3,HIGH);
    digitalWrite(ground1,HIGH);
    digitalWrite(ground5,HIGH);   
    
    //Write block
    analogWrite(red1, 255);
    analogWrite(green1, 255);
    analogWrite(blue1,255);
    analogWrite(red2, 255);
    analogWrite(green2, 255);
    analogWrite(blue2, 255);
    digitalWrite(ground4,LOW);
  }
  if (index == 5){
    digitalWrite(ground2,HIGH);
    digitalWrite(ground3,HIGH);
    digitalWrite(ground4,HIGH);
    digitalWrite(ground1,HIGH);   
    
    //Write block

    analogWrite(red1, 0);
    analogWrite(green1, 0);
    analogWrite(blue1,0);
    analogWrite(red2, 0);
    analogWrite(green2, 0);
    analogWrite(blue2, 0);
    digitalWrite(ground5,LOW);
  }
  delay(3);
  index++;
}
