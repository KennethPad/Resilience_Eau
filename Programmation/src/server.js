import session from "express-session";
import { resolve } from 'path';
import express from 'express';
import 'dotenv/config';

const app = express();

process.traceDeprecation = false;
process.removeAllListeners()

process.noDeprecation = true;

// Middlewares
app.set('views', resolve('./src/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve('./src/public')));
app.use(express.json());

app.use(
    session({
        secret: process.env.secretSession,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 * 24
        }
    })
);

// Route
import apiRoute from './routes/api.js';
import authRoute from './routes/auth.js';
import adminRoute from './routes/admin.js';
import dashboardRoute from './routes/dashboard.js';

app.use('/api', apiRoute);
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', (_, res) => res.render('home'));
app.get('*', (_, res) => res.status(404).render('errors/404'));

const port = process.env.port || 3000;
app.listen(port, () => console.log(`[Water Project] Listen on port ${port}`));