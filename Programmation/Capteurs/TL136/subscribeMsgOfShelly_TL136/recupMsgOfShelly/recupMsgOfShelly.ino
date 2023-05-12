#include <WiFi.h>
#include <PubSubClient.h>


//code Arduino qui utilise la bibliothèque PubSubClient pour se connecter à un broker MQTT et recevoir les messages publiés par le Shelly Uni.


const char* ssid = "nom_du_reseau_wifi";
const char* password = "mot_de_passe_wifi";
const char* mqttServer = "adresse_IP_du_broker_mqtt";
const char* mqttUsername = "nom_d_utilisateur_mqtt";
const char* mqttPassword = "mot_de_passe_mqtt";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  client.setServer(mqttServer, 1883);
  client.setCallback(callback);

  while (!client.connected()) {
    Serial.println("Connecting to MQTT server...");
    if (client.connect("arduinoClient", mqttUsername, mqttPassword )) {
      Serial.println("Connected to MQTT server");
      client.subscribe("shellyUni/capteurTL-136");
    } else {
      Serial.print("Failed with state ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void loop() {
  client.loop();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received [");
  Serial.print(topic);
  Serial.print("]: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Traitez les données reçues ici
}
