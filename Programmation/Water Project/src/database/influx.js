import { InfluxDB } from 'influx';

export default class Influx extends InfluxDB {

    constructor() {
        super({
            host: '192.168.143.73',
            database: "sensorData"
        });
    };

    async getData() {

        const data = await this.query('SELECT * FROM influxdata').catch((err) => console.log(err));

        return data.map((data) => data = {
            date: data.time.toLocaleString('fr-FR'),
            temperature: parseInt(data.temperature),
            waterLevel: parseFloat(data.waterLevel),
            waterQuality: parseFloat(data.waterQuality)
        });
    };

    async setData(data) {
        return this.writePoints(data)
            .then(() => console.log('Data inserted successfully'))
            .catch((err) => console.log(err));
    };
};