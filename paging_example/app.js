
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

const connection = mysql.createConnection({ // NOTE: mysql connection
  host: 'localhost',
  user: 'root',
  database: 'paging_test',
});

app.get('/', (req, res) => {
  const pageNum = Number(req.query.pageNum) || 1; // NOTE: 페이지 번호 값, 기본값은 1
  const contentSize = 10; // NOTE: 페이지에서 보여줄 컨텐츠 수.
  const pnSize = 10; // NOTE: 페이지네이션 개수 설정.
  const skipSize = (pageNum - 1) * contentSize; // NOTE: 다음 페이지 갈 때 건너뛸 리스트 개수.

  connection.query('SELECT count(*) as `count` FROM `articles`', (countQueryErr, countQueryResult) => {
    if (countQueryErr) throw countQueryErr;
    const totalCount = Number(countQueryResult[0].count); // NOTE: 전체 글 개수.
    const pnTotal = Math.ceil(totalCount / contentSize); // NOTE: 페이지네이션의 전체 카운트
    const pnStart = ((Math.ceil(pageNum / pnSize) - 1) * pnSize) + 1; // NOTE: 현재 페이지의 페이지네이션 시작 번호.
    let pnEnd = (pnStart + pnSize) - 1; // NOTE: 현재 페이지의 페이지네이션 끝 번호.
    connection.query('SELECT * FROM `articles` ORDER BY id DESC LIMIT ?, ?', [skipSize, contentSize], (contentQueryErr, contentQueryResult) => {
      if (contentQueryErr) throw contentQueryErr;
      if (pnEnd > pnTotal) pnEnd = pnTotal; // NOTE: 페이지네이션의 끝 번호가 페이지네이션 전체 카운트보다 높을 경우.
      const result = {
        pageNum,
        pnStart,
        pnEnd,
        pnTotal,
        contents: contentQueryResult,
      };
      res.render('index', {
        articles: result,
      });
    });
  });
});

app.get('/view/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM `articles` WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    res.render('view', {
      article: results[0],
    });
  });
});


app.listen(PORT, () => {
  console.log(`express is running on port ${PORT}`);
});
