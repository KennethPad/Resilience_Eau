import users from '../database/users.json' assert { type: 'json' };
import InfluxDB from '../database/influx.js';
import { checkAuth } from '../utils.js';
import { Router } from "express";

const router = Router();

router.get('/home', checkAuth, async (req, res) => res.render('dashboard/home', { connectedUser: users.find((user) => user.username === req.session.username), dataChart: await (new InfluxDB().getData()) }));

export default router;