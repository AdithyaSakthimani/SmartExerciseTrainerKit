#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "Redmi Note 11 Pro+ 5G";
const char* password = "12345678@";

// Server URL
const char* serverUrl = "http://192.168.219.160:8001/sensordata";

// Create MPU6050 object
Adafruit_MPU6050 mpu;

void setup() {
    // Initialize Serial Monitor for debugging
    Serial.begin(115200);
    while (!Serial);

    // Initialize UART (Serial1) to receive data from NodeMCU
    Serial1.begin(115200, SERIAL_8N1, 16, 17); // RX (GPIO 16), TX (GPIO 17)

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nWiFi Connected!");

    // Initialize MPU6050
    if (!mpu.begin()) {
        Serial.println("Could not find MPU6050 sensor!");
        while (1);
    }

    // Configure MPU6050
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

    Serial.println("MPU6050 initialized!");
}

void loop() {
    // Get MPU6050 sensor data
    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    // Create JSON document
    StaticJsonDocument<200> doc;
    
    // Add MPU6050 data
    doc["temperature"] = temp.temperature;
    doc["accel_x"] = a.acceleration.x;
    doc["accel_y"] = a.acceleration.y;
    doc["accel_z"] = a.acceleration.z;
    doc["gyro_x"] = g.gyro.x;
    doc["gyro_y"] = g.gyro.y;
    doc["gyro_z"] = g.gyro.z;

    // Read data from NodeMCU via UART
    String heart_rate = "";
    String spo2 = "";
    
    if (Serial1.available() > 0) {
        String nodeMCUData = Serial1.readString();

      
        doc["NodemCuData"] = nodeMCUData;
    
        
        Serial.print("Data from NodeMCU Sent");
        Serial.println(nodeMCUData);

    }

    // Print sensor data to Serial for debugging
    Serial.print("Temp: "); Serial.println(temp.temperature);
    Serial.print("Accel X: "); Serial.print(a.acceleration.x);
    Serial.print(" Y: "); Serial.print(a.acceleration.y);
    Serial.print(" Z: "); Serial.println(a.acceleration.z);
    Serial.print("Gyro X: "); Serial.print(g.gyro.x);
    Serial.print(" Y: "); Serial.print(g.gyro.y);
    Serial.print(" Z: "); Serial.println(g.gyro.z);

    // Send data to server if WiFi is connected
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        
        // Serialize JSON to string
        String jsonString;
        serializeJson(doc, jsonString);

        // Send HTTP POST request
        http.begin(serverUrl);
        http.addHeader("Content-Type", "application/json");
        
        int httpResponseCode = http.POST(jsonString);
        
        if (httpResponseCode > 0) {
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);
        } else {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }
        
        http.end();
    }

    delay(500); // Wait for 500 ms before next reading
}