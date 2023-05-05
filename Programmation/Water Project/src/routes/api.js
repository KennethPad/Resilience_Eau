import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../../swagger.js';
import { Router } from "express";
const router = Router();

import weatherRoute from '../routes/weather.js';

router.use('/weather', weatherRoute);

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;