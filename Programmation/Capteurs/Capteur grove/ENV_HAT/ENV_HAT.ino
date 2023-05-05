/*
    note: need add library Adafruit_BMP280 from library manage
    Github: https://github.com/adafruit/Adafruit_BMP280_Library
    https://wiki.seeedstudio.com/Grove-TDS-Sensor/
*/

#include <Adafruit_BMP280.h>
#include <M5StickC.h>
#include <Wire.h>
#include "SHT3X.h"

#include "Adafruit_Sensor.h"

#include <WiFi.h>
#include "PubSubClient.h" // Connect and publish to the MQTT broker

//Capteur de qualité d'eau
#define sensorPin 33                                            
int sensorValue = 0;
float tdsValue = 0;
float Voltage = 0;


// Input the SSID and password of WiFi
const char* ssid = "LPiOTIA";
//const char* ssid = "AndroidAP…";
const char* password = "";
//static const char* connectionString = "";
//MQTT
const char* mqtt_server = "192.168.143.72"; // IP of the MQTT broker
const char* WaterQuality_topic = "/home/ext/capteurs/WaterQuality";
// MQTT username
const char* clientID = "M5_DG"; // MQTT client ID
// Initialise the WiFi and MQTT Client objects
WiFiClient wifiClient;
// 1883 is the listener port for the Broker
PubSubClient client(mqtt_server, 1883, wifiClient);
float t;




void setup() {
    // put your setup code here, to run once:
    Serial.begin(115200);
    Serial.println("Starting connecting WiFi.");
    delay(10);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    }
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    
    if (client.connect(clientID)) {
    Serial.println("Connected to MQTT Broker!");
    }
    else { Serial.println("Connection to MQTT Broker failed...");}

}

void loop() {
    
      Serial.println("start sending events.");
      
    sensorValue = analogRead(sensorPin);
    //Serial.print(sensorValue);
    Voltage = sensorValue*5/4096.0; //Convert analog reading to Voltage
    if (Voltage != 0){
    tdsValue=(133.42/Voltage*Voltage*Voltage - 255.86*Voltage*Voltage + 857.39*Voltage)*0.5; //Convert voltage value to TDS value
    }
    Serial.print("TDS Value = "); 
    Serial.print(tdsValue);
    Serial.println(" ppm");
   
      //MQTT Send
      if (client.publish(WaterQuality_topic, String(tdsValue).c_str())) {
      Serial.println("Water quality sent!");
      Serial.println(tdsValue);
      }
      delay(5000);
          
}
