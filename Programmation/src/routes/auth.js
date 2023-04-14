import users from '../database/users.json' assert { type: 'json' };
import { Router } from "express";
import bcrypt from 'bcrypt';
import fs from 'fs';

const router = Router();

router.get('/', (_, res) => res.render('auth/home'));

router.get('/login', (_, res) => res.render('login', { errors: [] }));

router.post('/login', (req, res) => {

    const findUser = users.find((user) => user.username === req.body.username);

    if(!findUser) return res.render('login', { errors: [ "badUsername" ] });

    bcrypt.compare(req.body.password, findUser.password, (err, same) => {
        
        if(err) return res.render('errors/occurred');
        
        if(!same) return res.render('login', { errors: [ "badPassword" ] });
        
        req.session.username = findUser.username;

        res.redirect('/dashboard/home');
    });

});

router.get('/logout', (req, res) => {

    if(!req.session.username) return res.redirect('/');

    req.session.destroy();

    return res.redirect('/');
});

export default router;