
const mysql = require('mysql2');

const connection = mysql.createConnection({ // NOTE: mysql connection
  host: 'localhost',
  user: 'root',
  database: 'paging_test',
});

const sql = 'CREATE TABLE articles (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), text text)';

connection.execute(
  sql,
  (err, results) => {
    if (err) console.log(err);
    console.log(results);
  },
);
