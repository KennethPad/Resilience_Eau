import users from '../database/users.json' assert { type: 'json' };
import { Router } from "express";
const router = Router();

router.get('/home', (req, res) => res.render('dashboard/home', { connectedUser: users.find((user) => user.username === req.session.username) }));

export default router;