int S0 = 7;
int S1 = 6;
int S2 = 5;
int S3 = 4;
int analogMux = A0;

void setup() {
  Serial.begin(9600);
  pinMode(analogMux, INPUT);
  pinMode(S0,OUTPUT);
  pinMode(S1,OUTPUT);
  pinMode(S2,OUTPUT);
  pinMode(S3,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  for (int i = 0; i < 8; i++) {
    padPrint(analogMuxRead(i),3);
    Serial.print(" ");
  }
  Serial.println("");
}

int setAnalogMux(int channel) {
  digitalWrite(S3, HIGH && (channel & B00001000));
  digitalWrite(S2, HIGH && (channel & B00000100));
  digitalWrite(S1, HIGH && (channel & B00000010));
  digitalWrite(S0, HIGH && (channel & B00000001));
}

int analogMuxRead(int channel) {
  setAnalogMux(channel);
  return map(analogRead(analogMux),0,1023,0,100);
}

void padPrint(int value, int width)
{
  // pads values with leading zeros to make the given width
  char valueStr[6]; // large enough to hold an int
  itoa (value, valueStr, 10);
  int len = strlen(valueStr);
  if(len < width){
    len = width-len;
    while(len--)
     Serial.print(' ');
  }
 Serial.print(valueStr);   
}
