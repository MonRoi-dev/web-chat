import pkg from 'pg';
const Pool = pkg.Pool;
const pool = new Pool({
    user: 'postgres',
    password: '2002',
    host: 'localhost',
    port: '5432',
    database: 'web_chat',
});

export default pool;
