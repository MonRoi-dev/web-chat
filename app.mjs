import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import exhbs from 'express-handlebars';
import mainRoute from './routes/main.mjs';
import logRoute from './routes/auth.mjs';
import onConnection from './socket_io/connection.mjs';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app = express();

const server = createServer(app);
const io = new Server(server);
const hbs = exhbs.create({
    extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(mainRoute);
app.use('/auth', logRoute);

io.on('connection', (socket) => {
    onConnection(io, socket);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server was started on port: ${PORT}`);
});
