import { Router } from "express";
const router = Router();

import weatherRoute from '../routes/weather.js';

router.get('/', (_, res) => res.render('api/home'));

router.use('/weather', weatherRoute);

export default router;