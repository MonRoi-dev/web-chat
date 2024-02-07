import db from '../db.mjs'

class Message {
    async createMessage(req, res) {
        const {message, user} = req.body
        const msg = await db.query('INSERT INTO messages (content , user_id) values ($1 , $2) RETURNING *', [message, user.id])
    }
    async findMessage(req, res) {
        
    }
}

export default new Message();
