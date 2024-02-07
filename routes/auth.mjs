import { Router } from 'express';
import { check } from 'express-validator';
import authController from '../controllers/auth.mjs';
import userController from '../controllers/user.mjs';

const router = Router();

router.get('/login', authController.getLog);
router.post('/login', [
    check('email', 'Invalid email').isEmail().notEmpty(),
    check('password', 'Password is empty').isLength({min: 4, max: 24}).notEmpty()
],
userController.login);
router.get('/registration', authController.getReg);
router.post('/registration',[
    check('username', 'Username is empty').notEmpty(),
    check('email', 'Invalid email').isEmail().notEmpty(),
    check('password', 'Password is empty').isLength({min: 4, max: 24}).notEmpty()
], userController.registration);

export default router;
