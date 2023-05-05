import users from '../database/users.json' assert { type: 'json' };
import { checkAuth } from '../utils.js';
import { Router } from "express";
const router = Router();

router.get('/home', checkAuth, (req, res) => res.render('dashboard/home', { connectedUser: users.find((user) => user.username === req.session.username) }));

export default router;