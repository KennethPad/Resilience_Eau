/*
    note: need add library Adafruit_BMP280 from library manage
    Github: https://github.com/adafruit/Adafruit_BMP280_Library
    https://forum.arduino.cc/t/gravity-throw-in-type-liquid-level-transmitter-pressure-sensor/616098/4
*/

#include <Adafruit_BMP280.h>
#include <M5StickC.h>
#include <Wire.h>
#include "SHT3X.h"

#include "Adafruit_Sensor.h"

#include <WiFi.h>
#include "PubSubClient.h" // Se connecter et publier sur le broker MQTT

//Capteur de qualité d'eau
#define sensorPin 33                                            


//ID et le mot de passe du WiFi
const char* ssid = "LPiOTIA";
const char* password = "";

//MQTT
const char* mqtt_server = "192.168.143.73"; // IP MQTT broker
const char* WaterQuality_topic = "/home/ext/capteurs/WaterQuality";

// Nom d'utilisateur MQTT
const char* clientID = "M5_DG"; // MQTT client ID
// Initialise les objets WiFi et Client MQTT
WiFiClient wifiClient;
// 1883 est le port d'écoute du Broker
PubSubClient client(mqtt_server, 1883, wifiClient);
float t;




void setup() {
  
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

    pinMode(sensorPin, INPUT); // Configurer la broche du capteur en entrée
}

void loop() {
    
      Serial.println("start sending events.");
      
    float waterLevel = analogRead(sensorPin); // Lire la valeur analogique du capteur
    Serial.print("Niveau d'eau: ");
    Serial.print(waterLevel);
    Serial.println(" cm"); // Afficher le niveau d'eau en cm
    delay(1000); // Attendre 1 seconde avant de lire à nouveau les données


      //MQTT Send
      if (client.publish(WaterQuality_topic, String(waterLevel).c_str())) {
      Serial.println("Water quality sent!");
      Serial.println(waterLevel);
      }
      delay(5000);
          
}
