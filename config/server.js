require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Connected to database');
    conn.release();
  });
module.exports = pool;
