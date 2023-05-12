# Resilience Eau
## Description
> Ce projet permet l'économie d'eau à travers 2 facteurs qui sont la récupération des eaux de pluie et la réutilisation des eaux usées venant des sanitaires, et son exploitation.  
> Pour réaliser ce projet, il est importer de se renseigner sur les enjeux, et préservation de l'eau.
Comme par exemple, connaitre cette règle de stockage : "Le stockage de l'eau doit être fait dans une cuve hors-sol ou enterrée. Aucun produit anti-gel ne doit être appliqué dans la cuve de stockage."  
source : https://www.service-public.fr/particuliers/vosdroits/F31481  
>Cette solution est mis en oeuvre pour un campus ayant la capacité d'acceuillir environ 3000 étudiants, donc le choix de la manière d'approche de stockage est très importants ainsi que les technologies, équipements utilisés.  
</br>

## Pour commencer

- Se renseigner sur l'importance du sujet, connaître les enjeux et besoins de la préservation de l'eau.
- Exemple de règle à respecter :  
Règle principale stockage des eaux : 
- Le stockage de l'eau doit être fait dans une cuve hors-sol ou enterrée. Aucun produit anti-gel ne doit être appliqué dans la cuve de stockage. 




### Technologies et équipements utilisées
- Raspberry PI 3
- Capteurs
- Arduino
- Broker mosquitto (MQTT)
- IOTSTACK
- Node-Red
- Nginx
- Influxdb 1.18
- Docker
- Node.JS

</br>
<br/>

### Installation 

#### IoTStack contenant : Docker, Node-Red, influxdb, mosquitto (mqtt)  
> IoTstack est une plateforme open source pour la gestion de projets IoT basée sur Docker. Elle fournit un ensemble d'outils préconfigurés pour permettre aux développeurs et aux ingénieurs de déployer rapidement des projets IoT à grande échelle. IoTstack utilise Docker pour isoler chaque service et les exécuter de manière indépendante sur une machine hôte. Cela permet de simplifier la gestion des différents composants d'un projet IoT et de faciliter la mise à l'échelle.
</br>  

##### Pré-requis :  
s'assurer que votre raspberry Pi 3/4 est mis à jours.
```
sudo apt update
sudo apt upgrade
```  
##### Les étapes d'installations :  
- Télécharger IoTStack à l'aide de la commande suivante et redémarrer une fois le téléchargement terminé :  
```
curl -fsSL https://raw.githubusercontent.com/SensorsIot/IOTstack/master/install.sh | bash
sudo shutdown -r now
```
- Se rendre sur le dossier IoTStack qui vient d'être crée, puis executer en mode sudo le menu :  
```
cd IOTstack/
sudo ./menu.sh
```
- Vous aurez ensuite cette interface :  
![alt iotTack](https://ddrei.net/media/2021/02/IOTstack_mariadb_nc.png)

- Dans ce menu naviguez avec les flèches haut et bas puis espace pour sélectionner. Enter construira le fichier docker-compose.yml. Assurez-vous de sélectionner les composants suivants : 
influxdb, mosquitto, Node-Red, Grafana _(non necessaire)_ .
- Vous pouvez ensuite démarrer tous ces conteneurs avec la commande "Start Stack" 

<br/>
<br/>


#### Création de la base de donnée influxdb(version 1.18)
- Se rendre dans le conteneur influx Docker :  
```
docker exec -it influxdb influx
CREATE DATABASE sensor_data
```
`sensor_data` - nom de la base de donnée

- Vous pouvez désormais envoyer des données vers un measurement (table) depuis Node-Red ou sinon réaliser ce code :  
```
insert influxdata temperature="0",willRain=false,rainToday=false,waterLevel="0.0",waterQuality="0.0",drought=false
```
`influxdata` - nom de la mesure (table)  
`temperature="0"` - temperature est un champ de la table, 0 est la valeur du champ.

- Pour observer les valeurs de la table, vus devez selectionner sa base de donnée ici `sensor_data` puis la commande select :  
```
docker exec -it influxdb influx
USE sensor_data
show measurements
select * from influxdata
quit
```
Présentation d'un select * :  
![alt iotTack](https://preview.redd.it/rr5p6xxjagp51.png?width=374&format=png&auto=webp&s=4738b7bf2712b3ca1b1b98c522a6b9e59e996d67)

- Exemple de donnée envoyé via Node-Red. : 
```
{
    "temperature": msg.payload.t,
    "willRain": msg.payload.p,
    "waterQuality": msg.payload.h,
    "waterLevel": msg.payload.g
}
```

<br/>
<br/>




#### Nginx
> Nginx (prononcé "Engine-X") est un serveur web open source, léger et performant. Il est principalement utilisé pour servir des pages web statiques ou dynamiques et pour effectuer des opérations de proxy inverse, de mise en cache et de répartition de charge sur des sites web à forte demande.
<br>

- Installer Nginx:  
```
sudo apt install nginx
```
- Modifier ensuite le fichier de configuration nginx afin que votre raspberry PI soit accessible depuis l'exterieur.  
- Rajouter le code ci-dessous dans `http { }`:  
```
upstream influx {
          server 127.0.0.1:8086;
        }
 server {
          listen 80;
          root /usr/share/nginx/html;
          index index.html index.htm;

          location /influx/ {
            proxy_pass http://localhost:8086/;
            proxy_set_header Host                 $http_host;
            proxy_set_header X-Real-IP            $remote_addr;
            proxy_set_header X-Forwarded-For      $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto    "http";
          }
        }
```

<br/>
<br/>


#### Node.JS
> Node.js® est un environnement d’exécution JavaScript construit sur le moteur JavaScript V8 de Chrome. Ce n'est pas un serveur, ce n'est pas un framework, c'est un environnement d’exécution JavaScript.
<br/>

##### Comment installer Node.JS ? (sur Windows)

> Pour commencer nous devons nous rendre sur [https://nodejs.org/fr](https://nodejs.org/fr) afin de télécharger la version recommandée pour la plupart des utilisateurs (LTS). <br/>
On exécute le fichier node-v{version lts}.msi et nous allons suivre les étapes d'installation en cliquant sur "Next". <br/>
Dès que l'installation de Node.JS est terminée, l'environnement d’exécution JavaScript est démarré !  

<br/>


》Tableau de bord (Dashboard)
> Ce tableau de bord permet l'affichage et gestion des données. Il est relié à la base de donnée InfluxDB.  

》API Rest
> L'API Rest permet d'envoyer des données concernant des prévisions métérologiques.  
> Elle possède actuellement 2 endpoints qui permet de récupérer les périodes de pluie prévues pour les 3 prochains jours et les températures prévues pour les prochaines 24 heures.  

》Démarrer le Dashboard & l'API  
> Tout d'abord, il nous faut installer les packages se trouvant dans le package.json, nous allons exécuter cette commande :  
```js
npm install
```
> Nous voulons ensuite démarrer le projet, nous allons exécuter cette commande :
```js
npm run start
```

> Dès que le projet est démarré, un message apparaît : "[Water Project] Listen on port 3000".
> Ce message permet de dire que le projet écoute sur le port 3000 du localhost qui est accessible à cette adresse : [http://localhost:3000](http://localhost:3000).  

Un utilisateur "Test" est présent dans la liste des utilisateurs pour tester le Dashboard.
Identifiant : Test  
Mot de passe : test  


<br/>
<br/>


#### Explication des équipements et de la technologies
>Afin de mener à bien le projet de la résilience de l'eau, nous nous sommes renseigner sur les différentes manières de stocker l'eau, qui sont les suivantes :  
- barrages
- réservoirs
- cuves
-  puits

En examinant ces diverses approches, nous avons opter pour l'approche de la cuve, plus précisement de la cuve souterraine, car cela ne réduits pas l'espace du campus de plus elle permet de mieux conserver l'état de l'eau, du fait qu'elle n'est pas exposé au soleil.  

##### Matériels
- Concernant les capteurs, nous avons eu besoin de deux capteurs, 1 capteur de niveau d'eau _(mesurant la quantité d'eau dans la cuve)_, 1et 1 capteur de qualité d'eau _(mesurant la salinité de l'eau)_.  
- Pour les actionneurs, nous avons opter pour des vannes qui permettent de bloquer et activer des cours d'eau donc permettra de gérer le flux de l'eau.  
- Nous avons aussi besoin d'un système intelligent nous permettant de traitter les données reçus et de donnée des directions.  
- Et enfin Nous avons besoin d'une interface graphique afin que des utilisateurs, tels qu'un administrateur du campus ou un jardinier puisse manipuler facilement l'eau de la cuve sans être informaticien.   

###### Capteurs/Actionneurs  
Afin de communiquer facilement avec le système intilligent, nous avons fais le choix d'utiliser un broker MQTT étudier en classe et facile d'implémentation, de plus des données peuvent être envoyé par les capteurs de façon continu sans avoir le besoin de faire des requete http.  
Les actionneurs devraient eux s'abonner à un topic du broker afin de recevoir des ordres du système intelligent.  

####### Mosquitto commande
> Nginx (prononcé "Engine-X") est un serveur web open source, léger et performant. Il est principalement utilisé pour servir des pages web statiques ou dynamiques et pour effectuer des opérations de proxy inverse, de mise en cache et de répartition de charge sur des sites web à forte demande.

- commande pour publier à un topic:  
```
mosquitto_pub -h 192.168.143.73 -t /home/ext/capteurs/TL136 -m "100"
```
`192.168.143.73` - est l'ip du serveur, il peut être local en le remplacer par "localhost" 
`-t` - pour renseigner le topic.  
`/home/ext/capteurs/TL136` - est le topic.  
`100` - est la valeur envoyée.  

- commande pour écouter un topic:  
```
mosquitto_sub -h 192.168.143.73 -t /home/controller -v
```
`192.168.143.73` - est l'ip du serveur, il peut être local en le remplacer par "localhost"  
`-t` - pour renseigner le topic.  
`/home/controller` - est le topic d'écoute.  
`-v` - option utilisée pour afficher les messages en mode verbeux.  



###### Système intelligent  
Afin de gérer les transactions et stocker les données, nous avons opter pour l'utilisation de Node-Red qui peut simuler une sorte de système intelligent grâce à des noeuds fonctions.  
La récupérations des donnéées de capteurs se fait via des topics, ensuite le système intègre des fonctions permettant de traiter et gérer les informations reçus afin de les stocker dans une base de donnée , et de les traiter via une intelligence artificiel (algorithme) afin de donner des ordres aux actionneurs via un topic.  
Le choix de la base de donnée a été faite en fonction de la manière à pouvoir stocker des donnée périodiquement et facilement.  

>Précision  
>Afin de rendre notre système plus précis, nous avons fait appel à un service api, nous permettant d'avoir accès au prévisions méteo, et alors être capable d'ordonnancer de manière plus efficace la gestion du flux de l'eau autours du campus.  

###### Configuration  
Pour permettre l'accès à notre raspberry Pi depuis l'exterieur, nous avons choisis la solution Nginx étudier en classe et très répandu.  

###### Affichage  
Le tableau de bord est réalisé grâce à toutes les données stocker en continu dans la base de donnée. A l'aide de Node.JS et précisement chart.JS, nous avons obtenu un affichage dynamique et en temps réel.  
Via le javascript, html et css, nous avons eu la possibilité de mettre en place une page "programmer heure" permettant au jardinier de programmer les heures d'arrosage, pour que l'action se réalise automatiqument.  

<br/>
<br/>

#### Sources

[video youtube : IoTsTack Raspberry Pi (en anglais)](https://www.youtube.com/watch?v=_DO2wHI6JWQ&ab_channel=LearnEmbeddedSystems)  
[lien des commandes à réaliser IoTStack](https://www.youtube.com/watch?v=_DO2wHI6JWQ&ab_channel=LearnEmbeddedSystems)  
[lien installation Nginx](https://raspberrytips.fr/nginx-sur-raspberry-pi/)  
[journal Le Monde](https://www.lemonde.fr/podcasts/article/2022/07/05/secheresses-a-repetition-la-france-va-t-elle-manquer-d-eau_6133352_5463015.htmlc)  
[journal LesEhos](https://www.lesechos.fr/politique-societe/politique/climat-les-ressources-deau-renouvelable-diminuent-en-france-1416004#:~:text=L'eau%20que%20la%20France,minist%C3%A8re%20de%20la%20Transition%20%C3%A9cologique.&text=C'est%20une%20nouvelle%20d%C3%A9monstration%20concr%C3%A8te%20des%20cons%C3%A9quences%20du%20d%C3%A9r%C3%A8glement%20climatique.)  
[fondation de France](https://www.fondationdefrance.org/fr/cat-environnement/l-eau-une-ressource-precieuse-a-preserver#:~:text=Elle%20est%20non%20seulement%20vitale,chaque%20ann%C3%A9e%20le%2022%20mars.)  
[Les enjeux liés à l'eau : L'environnement en Nord-Pas-de-Calais](https://www.hauts-de-france.developpement-durable.gouv.fr/?-Les-enjeux-lies-a-l-eau-)  
[Les enjeux liés à l'eau : AFD](https://www.afd.fr/fr/actualites/dossier-eau-un-enjeu-mondial#:~:text=L'eau%20est%20un%20d%C3%A9fi,de%20vie%20des%20personnes%20d%C3%A9favoris%C3%A9es.)  

<br/>
<br/>

## Hackster.io
[lien du hackster.io](https://www.hackster.io/kennethpadonou06/resilience-to-the-water-resource-problem-3fb877)

<br/>
<br/>


## Développeurs
- [kennethPad](https://github.com/kennethPad) (Kenneth)
- [Futogi](https://github.com/Futogi) (Dorian)
- [KushiieDev](https://github.com/KushiieDev) (Maël)
