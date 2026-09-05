const { Pool, types } = require('pg');

// Tự động chuyển đổi PostgreSQL NUMERIC (OID 1700) sang Number thay vì String
types.setTypeParser(1700, (val) => val === null ? null : parseFloat(val));
const path = require('path');
const fs = require('fs');

const envPath = fs.existsSync(path.join(__dirname, '.env'))
  ? path.join(__dirname, '.env')
  : path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
