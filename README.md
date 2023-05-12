# Resilience Eau
> Ce projet permet l'économie d'eau à travers 2 facteurs qui sont la récupération des eaux de pluie et la réutilisation des eaux usées venant des sanitaires, et son exploitation. Pour réaliser ce projet, il est importer de se renseigner sur les enjeux, et préservation de l'eau.
Comme par exemple, connaitre cette règle de stockage : "Le stockage de l'eau doit être fait dans une cuve hors-sol ou enterrée. Aucun produit anti-gel ne doit être appliqué dans la cuve de stockage."
source : https://www.service-public.fr/particuliers/vosdroits/F31481
Cette solution est mis en oeuvre pour un campus ayant la capacité d'acceuillir environ 3000 étudiants, donc le choix de la manière d'approche de stockage est très importants ainsi que les technologies, équipements utilisés.
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



#### Node.JS
> Def de Node.JS
<br>

##### Pré-requis :  
s'assurer que votre raspberry Pi 3/4 est mis à jours.
```
sudo apt update
sudo apt upgrade
```






#### Sources

[video youtube : IoTsTack Raspberry Pi (en anglais)](https://www.youtube.com/watch?v=_DO2wHI6JWQ&ab_channel=LearnEmbeddedSystems)  
[lien des commandes à réaliser IoTStack](https://www.youtube.com/watch?v=_DO2wHI6JWQ&ab_channel=LearnEmbeddedSystems)  
[lien installation Nginx](https://raspberrytips.fr/nginx-sur-raspberry-pi/)  
[journal Le Monde](https://www.lemonde.fr/podcasts/article/2022/07/05/secheresses-a-repetition-la-france-va-t-elle-manquer-d-eau_6133352_5463015.htmlc)  
[journal LesEhos](https://www.lesechos.fr/politique-societe/politique/climat-les-ressources-deau-renouvelable-diminuent-en-france-1416004#:~:text=L'eau%20que%20la%20France,minist%C3%A8re%20de%20la%20Transition%20%C3%A9cologique.&text=C'est%20une%20nouvelle%20d%C3%A9monstration%20concr%C3%A8te%20des%20cons%C3%A9quences%20du%20d%C3%A9r%C3%A8glement%20climatique.)  
[fondation de France](https://www.fondationdefrance.org/fr/cat-environnement/l-eau-une-ressource-precieuse-a-preserver#:~:text=Elle%20est%20non%20seulement%20vitale,chaque%20ann%C3%A9e%20le%2022%20mars.)  
[Les enjeux liés à l'eau : L'environnement en Nord-Pas-de-Calais](https://www.hauts-de-france.developpement-durable.gouv.fr/?-Les-enjeux-lies-a-l-eau-)  
[Les enjeux liés à l'eau : AFD](https://www.afd.fr/fr/actualites/dossier-eau-un-enjeu-mondial#:~:text=L'eau%20est%20un%20d%C3%A9fi,de%20vie%20des%20personnes%20d%C3%A9favoris%C3%A9es.)  


## Hackster.io
[lien du hackster.io](https://www.hackster.io/kennethpadonou06/resilience-to-the-water-resource-problem-3fb877)


## Développeurs
- [kennethPad](https://github.com/kennethPad) (Kenneth)
- [Futogi](https://github.com/Futogi) (Dorian)
- [KushiieDev](https://github.com/KushiieDev) (Maël)
