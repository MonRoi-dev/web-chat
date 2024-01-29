import { Router } from 'express';
import { getRootHandler } from '../controllers/index.mjs';

const router = Router();

router.get('/', getRootHandler);

export default router;
