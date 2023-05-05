import session from "express-session";
import { resolve } from 'path';
import express from 'express';
import 'dotenv/config';

// Route
import apiRoute from './routes/api.js';
import authRoute from './routes/auth.js';
import adminRoute from './routes/admin.js';
import dashboardRoute from './routes/dashboard.js';

const app = express();

// Middlewares
app.set('views', resolve('./src/views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(resolve('./src/public')));
app.use(express.json());

app.use(
    session({
        secret: process.env.SECRET_SESSION,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 * 24
        }
    })
);

app.use('/api', apiRoute);
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
app.use('/dashboard', dashboardRoute);

app.get('/', (_, res) => res.render('home'));
app.get('*', (_, res) => res.status(404).render('errors/404'));

app.listen(process.env.PORT, () => console.log(`[Water Project] Listen on port ${process.env.PORT}`));