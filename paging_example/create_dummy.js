
const mysql = require('mysql2');

const connection = mysql.createConnection({ // NOTE: mysql connection
  host: 'localhost',
  user: 'root',
  database: 'paging_test',
});

const values = [];

for (let i = 0; i < 1000; i += 1) {
  const data = [`${i}번째 제목`, `${i}번째 글`];
  values.push(data);
}

console.log(values);

const sql = 'INSERT INTO `articles` (`title`, `text`) VALUES ?';

connection.query(sql, [values], (err, results) => {
  if (err) throw err;
  console.log(results);
});
