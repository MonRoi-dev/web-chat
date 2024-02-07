import db from '../db.mjs';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import secret from '../config.mjs';
import cookieParser from 'cookie-parser';

function generateAccessToken(id, username) {
    const payload = {
        id,
        username,
    };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
}

class UserController {
    async registration(req, res) {
        console.log(req.body);
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res
                    .status(400)
                    .json({ message: `${errors.errors[0].msg}` });
            }
            const { username, email, password } = req.body;
            const userFind = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            if (userFind.rows[0]) {
                console.log(userFind);
                res.status(400).json({ message: 'User already exist' });
            } else {
                let user;
                bcrypt.hash(password, 5, async function (err, hash) {
                    if (err) {
                        console.log(err);
                    } else {
                        user = await db.query(
                            'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
                            [email, username, hash]
                        );
                    }
                });
                console.log('User created!');
                res.render('index');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res
                    .status(400)
                    .json({ message: `${errors.errors[0].msg}` });
            }
            const { email, password } = req.body;
            const user = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `User with ${email} not found` });
            } else {
                bcrypt.compare(
                    password,
                    user.rows[0].password,
                    (err, result) => {
                        if (err) {
                            return res
                                .status(400)
                                .json({ message: 'Invalid passwod' });
                        } else {
                            return result;
                        }
                    }
                );
                const token = generateAccessToken(
                    user.rows[0].id,
                    user.rows[0].username
                );
                res.cookies;
                res.cookie(`jwt`, token, {
                    maxAge: 3600 * 24,
                    httpOnly: false,
                });
                return res.render('index');
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: 'Login error' });
        }
    }
}

export default new UserController();
