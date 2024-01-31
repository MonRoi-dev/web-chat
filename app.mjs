import express from 'express';
import { Server } from 'socket.io';
import 'dotenv/config';
import { createServer } from 'node:http';
import router from './routes/index.mjs';
import db from './db.mjs';

const app = express();
const PORT = process.env.PORT;
const server = createServer(app);
const io = new Server(server);

app.use(router);

io.on('connection', async (socket) => {
    let name = '';
    let uid;
    socket.on('user join', async (nickname) => {
        try {
            name = await db.query(
                'INSERT INTO users (nickname) VALUES ($1) RETURNING *',
                [nickname]
            );
            uid = name.rows[0].id;
            name = name.rows[0].nickname;
            console.log(uid);
        } catch (e) {
            console.log(e);
        }
    });

    socket.on('chat message', async (msg) => {
        let result;
        try {
            result = await db.query(
                'INSERT INTO messages (content, user_id) VALUES ($1, $2) RETURNING *',
                [msg, uid]
            );
        } catch (e) {
            return console.log(e);
        }
        io.emit('chat message', name + ': ' + msg, result.lastId);
    });
    if (!socket.recovered) {
        try {
            const res = await db.query(
                'SELECT id, content FROM messages WHERE id > $1',
                [0]
            );
            for (let row of res.rows) {
                socket.emit('chat message', row.content, row.id);
            }
        } catch (e) {
            console.log(e);
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server was started on port: ${PORT}`);
});
