import express from 'express';
import { Server } from 'socket.io';
import 'dotenv/config';
import { createServer } from 'node:http';
import { writeFile } from 'fs';
import router from './routes/index.mjs';

const app = express();
const PORT = process.env.PORT;
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {},
    // maxHttpBufferSize: 1e8,
});

app.use(router);

io.on('connection', (socket) => {
    console.log('User has been connected!');
    io.emit('chat message', 'User has been connected')
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('User has been disconnected!');
        io.emit('chat message', 'User has been disconnected')
    });
});

// io.on('connection', (socket) => {
//     socket.on('upload', (file, callback) => {
//         console.log(file); // <Buffer 25 50 44 ...>

//         // save the content to the disk, for example
//         writeFile('/tmp/upload', file, (err) => {
//             callback({ message: err ? 'failure' : 'success' });
//             console.log
//         });
//     });
// });

server.listen(PORT, () => {
    console.log(`Server was started on port: ${PORT}`);
});
