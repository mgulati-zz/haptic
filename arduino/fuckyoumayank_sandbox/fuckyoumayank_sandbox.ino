void setup() {
  // put your setup code here, to run once:
    Serial.begin(115200);
   pinMode(A2, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println(analogRead(A2));
}
