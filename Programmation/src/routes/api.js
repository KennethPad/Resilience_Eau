import { Router } from "express";
const router = Router();

router.get('/', (_, res) => res.render('api/home'));

export default router;