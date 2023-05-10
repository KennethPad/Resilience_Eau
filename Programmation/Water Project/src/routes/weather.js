import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /weather/rain:
 *   get:
 *     summary: Récupère les informations de prévision météorologique pour Valbonne à partir de l'API OpenWeatherMap.
 *     description: Renvoie les informations sur les périodes de pluie prévues pour les prochaines 24 heures.
 *     responses:
 *       200:
 *         description: Succès de la requête. Les informations sur les périodes de pluie prévues sont renvoyées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Code de statut personnalisé indiquant que la requête s'est terminée avec succès.
 *                 willRain:
 *                   type: boolean
 *                   description: Indique si de la pluie est prévue dans les prochaines 24 heures.
 *                 rainTimes:
 *                   type: array
 *                   description: Tableau d'objets décrivant chaque période de pluie prévue.
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Date et heure de début de la période de pluie.
 *                       description:
 *                         type: string
 *                         description: Description textuelle de la météo pendant la période de pluie.
 *                       temperature:
 *                         type: integer
 *                         description: Température prévue pendant la période de pluie, en degrés Celsius.
 *       403:
 *         description: Erreur de requête. Une description de l'erreur est renvoyée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Code de statut personnalisé indiquant qu'une erreur s'est produite.
 *                 error:
 *                   type: string
 *                   description: Description textuelle de l'erreur rencontrée.
 */
router.get('/rain', (_, res) => {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Valbonne&appid=${process.env.WEATHER_API_KEY}`)
        .then(res => res.json())
        .then(data => {

            const rainTime = [];

            data.list.slice(0, 8 * 3).forEach(item => {

                const weather = item.weather[0].main;
                const rain = item.rain ? item.rain['3h'] : 0;

                if (weather === 'Rain' || rain > 0) return rainTime.push({
                    date: new Date(item.dt_txt).toLocaleString(),
                    description: item.weather[0].description,
                    temperature: Math.round(item.main.temp - 273.15)
                });
            });

            if (rainTime.length > 0) return res.json({ status: 200, willRain: true, rainTimes: rainTime });
            else return res.json({ status: 200, willRain: false, rainTimes: [] });
        })
        .catch((err) => res.json({ status: 403, error: err }));
});

/**
 * @swagger
 * /weather/temperatures:
 *   get:
 *     summary: Récupère les informations de prévision météorologique pour Valbonne à partir de l'API OpenWeatherMap.
 *     description: Renvoie les informations sur les températures prévues pour les prochaines 24 heures.
 *     responses:
 *       200:
 *         description: Succès de la requête. Les informations sur les températures prévues sont renvoyées.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Code de statut personnalisé indiquant que la requête s'est terminée avec succès.
 *                 temperatures:
 *                   type: array
 *                   description: Tableau d'objets décrivant chaque température prévue.
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Date et heure de début de la période pour la température prévue.
 *                       description:
 *                         type: string
 *                         description: Description textuelle de la météo pendant la période.
 *                       temperature:
 *                         type: integer
 *                         description: Température prévue pendant la période, en degrés Celsius.
 *       403:
 *         description: Erreur de requête. Une description de l'erreur est renvoyée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: Code de statut personnalisé indiquant qu'une erreur s'est produite.
 *                 error:
 *                   type: string
 *                   description: Description textuelle de l'erreur rencontrée.
 */
router.get('/temperatures', (_, res) => {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Valbonne&appid=${process.env.WEATHER_API_KEY}`)
        .then(res => res.json())
        .then(data => {

            const allTemperatures = [];

            data.list.slice(0, 8).forEach(item => {
                return allTemperatures.push({
                    date: new Date(item.dt_txt).toLocaleString(),
                    description: item.weather[0].description,
                    temperature: Math.round(item.main.temp - 273.15)
                });
            });

            return res.json({ status: 200, temperatures: allTemperatures });
        })
        .catch((err) => res.json({ status: 403, error: err }));
});

export default router;