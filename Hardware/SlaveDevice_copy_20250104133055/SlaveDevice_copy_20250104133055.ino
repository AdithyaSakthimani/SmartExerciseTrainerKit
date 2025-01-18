#include <Wire.h>
#include <MAX30100_PulseOximeter.h>

PulseOximeter pox;  
uint32_t tsLastReport = 0;

void setup() {
  Serial.begin(115200);  // Start Serial communication with Arduino
  Wire.begin();  // Initialize I2C
  
  // Initialize MAX30100 (or your sensor)
  if (!pox.begin()) {
    Serial.println("Sensor initialization failed");
    while (1);  // Stop execution if sensor initialization fails
  }
  Serial.println("Sensor initialized");
}

void loop() {
  pox.update();  // Update the sensor data
  
  // Periodically send data to Arduino
  if (millis() - tsLastReport > 1000) {
    float heartRate = pox.getHeartRate();
    float spo2 = pox.getSpO2();
    
    // Send the data to Arduino via Serial
    Serial.print("HR: ");
    Serial.print(heartRate);
    Serial.print(" SpO2: ");
    Serial.println(spo2);
    
    tsLastReport = millis();
  }
}
