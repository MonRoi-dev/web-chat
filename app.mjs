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
    socket.on('chat message', async (msg) => {
        let result;
        try {
            result = await db.query(
                'INSERT INTO messages (content) VALUES ($1) RETURNING *',
                [msg]
            );
        } catch (e) {
            return console.log(e);
        }
        io.emit('chat message', msg, result.lastId);
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
