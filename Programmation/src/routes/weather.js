import { Router } from 'express';
const router = Router();

router.get('/rain', (_, res) => {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Valbonne&appid=${process.env.weatherAPIKey}`)
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

router.get('/freeze', (_, res) => {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Valbonne&appid=${process.env.weatherAPIKey}`)
        .then(res => res.json())
        .then(data => {

            const allTemperatures = [];

            data.list.slice(0, 8).forEach(item => {

                const temperature = Math.round(item.main.temp - 273.15);

                if(temperature <= 0) {
                    return allTemperatures.push({
                        date: new Date(item.dt_txt).toLocaleString(),
                        description: item.weather[0].description,
                        temperature: temperature
                    });
                };
            });

            if (allTemperatures.length > 0) return res.json({ status: 200, willFreeze: true, temperatures: allTemperatures });
            else return res.json({ status: 200, willFreeze: false, temperatures: [] });
        })
        .catch((err) => res.json({ status: 403, error: err }));
})

export default router;