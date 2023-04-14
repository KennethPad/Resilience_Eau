import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../swagger.js';
import { Router } from "express";
const router = Router();

import weatherRoute from '../routes/weather.js';

router.get('/', (_, res) => res.render('api/home'));

router.get('/endpoints', (_, res) => res.render('api/endpoints'));

router.use('/weather', weatherRoute);

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;