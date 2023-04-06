import { resolve } from 'path';
import express from 'express';
import 'dotenv/config';

const app = express();

// Middlewares
app.set('views', resolve('./src/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve('./src/public')));
app.use(express.json());

// Route
import apiRoute from './routes/api.js';

app.get('/', (_, res) => res.redirect('/api'));
app.use('/api', apiRoute);

app.get('*', (_, res) => res.status(404).render('errors/404'));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`[API] Listen on port ${port}`));