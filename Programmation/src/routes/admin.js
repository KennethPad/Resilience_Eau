import users from '../database/users.json' assert { type: 'json' };
import { checkAuth } from '../utils.js';
import { Router } from "express";
import bcrypt from 'bcrypt';
import fs from 'fs';

const router = Router();

router.get('/', (_, res) => res.render('admin/home'));

router.get('/register', checkAuth, (req, res) => res.render('admin/register', { connectedUser: users.find((user) => user.username === req.session.username), errors: [] }));

router.post('/register', async (req, res, next) => {

    const findUser = users.find((user) => user.username === req.body.username);

    if(findUser) return res.render('admin/register', { connectedUser: users.find((user) => user.username === req.session.username), errors: [ "alreadyExistUsername" ] });

    if(req.body.password !== req.body.confirmPassword) return res.render('admin/register', { connectedUser: users.find((user) => user.username === req.session.username), errors: [ "notSimilar" ] });

    users.push({ username: req.body.username, password: await bcrypt.hash(req.body.password, 10) });

    fs.writeFile('./src/database/users.json', JSON.stringify(users, null, 2), (err) => err ? res.render('errors/occurred') : next());

}, (_, res) => res.redirect('list'));


export default router;