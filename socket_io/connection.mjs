import db from '../db.mjs';

async function onConnection(io, socket) {
    socket.on('disconnect', () => {
        io.emit('chat message', 'Disconnected');
    });
    socket.broadcast.emit('chat message', 'Connected');
    socket.on('chat message', async (msg, id) => {
        let result;
        try {
            result = await db.query(
                'INSERT INTO messages (content, user_id) values ($1, $2) RETURNING (SELECT username FROM users WHERE id = $2) as username, content',
                [msg, id]
            );
        } catch (error) {
            return console.log(error);
        }
        io.emit('chat message', result.rows[0].username + ' : ' + result.rows[0].content);
    });

    if (!socket.recovered) {
        try {
            await db.query(
                'SELECT messages.content, users.username FROM messages JOIN users ON messages.user_id = users.id WHERE messages.id > $1',
                [0],
                (_err, row) => {
                    row.rows.forEach(async (el) => {
                        socket.emit(
                            'chat message',
                            el.username + ' : ' + el.content
                        );
                    });
                }
            );
        } catch (error) {
            console.log(error);
        }
    }

    socket.on('activity', (name) => {
        socket.broadcast.emit('activity', name)
    })
}

export default onConnection;