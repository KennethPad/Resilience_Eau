# Capteur TL-136 avec Shelly uni :  

**Voici les étapes générales pour configurer le Shelly Uni pour publier les données du capteur TL-136 dans un broker MQTT :**  

1. Configurez le Shelly Uni pour se connecter à votre réseau Wi-Fi.  

2. Dans les paramètres avancés du Shelly Uni, configurez la connexion au broker MQTT en entrant l'adresse IP ou l'URL du broker, le nom d'utilisateur et le mot de passe si nécessaire.  

3. Configurez les seuils de niveau d'eau et les actions souhaitées pour envoyer les données via MQTT. Par exemple, vous pouvez configurer le Shelly Uni pour publier un message MQTT à chaque fois que le niveau d'eau dépasse un seuil spécifique.  

4. Utilisez un client MQTT sur votre Arduino pour recevoir les messages MQTT publiés par le Shelly Uni et traiter les données.  

