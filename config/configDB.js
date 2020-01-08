var mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  // port: '3306',
  // password: 'password',
  port: '3307',
  password: '123456',
  database: 'crud'
});

module.exports = conn;