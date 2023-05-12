import schedule from '../database/schedule.json' assert { type: 'json' };
import users from '../database/users.json' assert { type: 'json' };
import InfluxDB from '../database/influx.js';
import { checkAuth } from '../utils.js';
import { Router } from "express";
import fs from 'fs';

const router = Router();

router.get('/home', checkAuth, async (req, res) => res.render('dashboard/home', { connectedUser: users.find((user) => user.username === req.session.username), dataChart: await (new InfluxDB().getData()) }));

router.get('/schedule', checkAuth, async (req, res) => res.render('dashboard/schedule', { connectedUser: users.find((user) => user.username === req.session.username) }));

router.post('/schedule', async (req, res, next) => {

    if(Object.keys(schedule).length === 0) schedule.oldSave = [];
    else schedule.oldSave.push({
        savedOn: schedule.savedOn,
        savedBy: schedule.savedBy,
        time: schedule.time
    });

    schedule.savedOn = new Date().toLocaleString("fr-FR");
    schedule.savedBy = req.session.username;
    schedule.time = req.body.time;

    fs.writeFile('./src/database/schedule.json', JSON.stringify(schedule, null, 2), (err) => err ? res.render('errors/404') : next());

}, (_, res) => {

    res.redirect('/dashboard/schedule');

});

router.get('/tanklevel', checkAuth, async (req, res) => res.render('dashboard/tanklevel', { connectedUser: users.find((user) => user.username === req.session.username) }));

export default router;