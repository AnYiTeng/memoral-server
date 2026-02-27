const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tomb_qr_code',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

pool
  .getConnection()
  .then((conn) => {
    conn.release();
    // eslint-disable-next-line no-console
    console.log('MySQL 连接成功');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('MySQL 连接失败:', err.message);
  });

module.exports = pool;

