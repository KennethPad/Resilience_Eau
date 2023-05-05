import { Router } from 'express';
const router = Router();

/**
 * @swagger
 * /weather/rain:
 *   get:
 *     summary: Renvoie les prévisions météorologique de la pluie sur les 3 prochains jours
 *     description: Récupère les prévisions météorologique des 3 prochains jours en fonction de la pluie
 *     responses:
 *       200:
 *         description: Prévisions météorologique des 3 prochains jours récupérée avec succès
 *       403:
 *         description: Erreur lors de la requête API à OpenWeatherMap
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
 *     summary: Renvoie les températures sur 24h
 *     description: Récupère les températures sur 24h
 *     responses:
 *       200:
 *         description: Prévisions de la température sur 24h récupérée avec succès
 *       403:
 *         description: Erreur lors de la requête API à OpenWeatherMap
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
})

export default router;