//#include <ESP8266WiFi.h>

#include <Adafruit_BMP280.h>
//#include <M5Stack.h>
#include <M5StickC.h>
#include <Wire.h>
#include "SHT3X.h"

#include "Adafruit_Sensor.h"

#include <WiFi.h>
#include <ArduinoJson.h>


#include "Timer.h"
#include "PubSubClient.h" // Se connecter et publier sur le broker MQTT

//SSID et le mot de passe du WiFi
const char* ssid = "LPiOTIA";
const char* password = "";

//MQTT
const char* mqtt_server = "192.168.143.73"; // IP du brocker MQTT
const char* controlleur_topic = "/home/controller";
// MQTT username
const char* clientID = "controlSub"; // MQTT client ID
// Initialise les objets WiFi et Client MQTTobjects
WiFiClient wifiClient;
// 1883 est le port d'écoute du Broker
PubSubClient client(mqtt_server, 1883, wifiClient);


    void callback(char* topic, byte *payload, unsigned int length)
    { Serial.println("-------Nouveau message du broker mqtt-----");
    Serial.print("Canal:");
    Serial.println(topic);
    Serial.print("Donnee:");
    Serial.write(payload, length);
    M5.Lcd.fillScreen(BLACK); // Efface l'écran
    
    // Analyse le message JSON
    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload, length);

    // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool vanneECiut = doc["vanneECiut"];
    M5.Lcd.setCursor(0, 0);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("vanneECiut: ");
    M5.Lcd.setTextColor(vanneECiut ? GREEN : RED);
    M5.Lcd.println(vanneECiut ? "true" : "false");

    // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool vanneECplante = doc["vanneECplante"];
    M5.Lcd.setCursor(0, 15);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("vanneECplante: ");
    M5.Lcd.setTextColor(vanneECplante ? GREEN : RED);
    M5.Lcd.println(vanneECplante ? "true" : "false");

     // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool VanneStockiut = doc["VanneStockiut"];
    M5.Lcd.setCursor(0, 30);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("VanneStockiut: ");
    M5.Lcd.setTextColor(VanneStockiut ? GREEN : RED);
    M5.Lcd.println(VanneStockiut ? "true" : "false");


     // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool VanneStockPlante = doc["VanneStockPlante"];
    M5.Lcd.setCursor(0, 45);
    M5.Lcd.setTextSize(2);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("VanneStockPlante: ");
    M5.Lcd.setTextColor(VanneStockPlante ? GREEN : RED);
    M5.Lcd.println(VanneStockPlante ? "true" : "false");


     // Check the value of "VanneStockPiscine" and update the display accordingly
    bool VanneStockPiscine = doc["VanneStockPiscine"];
    M5.Lcd.setCursor(0, 60);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("VanneStockPiscine: ");
    M5.Lcd.setTextColor(VanneStockPiscine ? GREEN : RED);
    M5.Lcd.println(VanneStockPiscine ? "true" : "false");


     // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool VanneStockVidange = doc["VanneStockVidange"];
    M5.Lcd.setCursor(0, 75);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("VanneStockVidange: ");
    M5.Lcd.setTextColor(VanneStockVidange ? GREEN : RED);
    M5.Lcd.println(VanneStockVidange ? "true" : "false");

     // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool diminuerArrosage = doc["diminuerArrosage"];
    M5.Lcd.setCursor(0, 90);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("diminuerArrosage: ");
    M5.Lcd.setTextColor(diminuerArrosage ? GREEN : RED);
    M5.Lcd.println(diminuerArrosage ? "true" : "false");


     // Vérifie la valeur de "vanneECiut" et met à jour l'affichage 
    bool augmenterArrosage = doc["augmenterArrosage"];
    M5.Lcd.setCursor(0, 105);
    M5.Lcd.setTextSize(1);
    M5.Lcd.setTextColor(WHITE);
    M5.Lcd.print("augmenterArrosage: ");
    M5.Lcd.setTextColor(augmenterArrosage ? GREEN : RED);
    M5.Lcd.println(augmenterArrosage ? "true" : "false");
    }

void setup() {
    M5.begin();   
     M5.Lcd.fillScreen(BLACK); // Efface l'écran                   
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
    
    Serial.println(controlleur_topic);

    client.setCallback(callback);
    
    if (client.connect(clientID)) {
      Serial.println("Connected to MQTT Broker!");
      client.subscribe(controlleur_topic);
    } else { 
      Serial.println("Connection to MQTT Broker failed...");
    }

}


 void loop() {

  client.loop();
  //delay(5000);




}
