#include <CapacitiveSensor.h>
CapacitiveSensor touchSense = CapacitiveSensor(52, 48);

void setup() {
  Serial.begin(115200);
  touchSense.set_CS_Timeout_Millis(250);
}

void loop() {
  Serial.println(touchSense.capacitiveSensor(10));
}
