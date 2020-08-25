const axios = require('axios'); // request 같은 모듈.
const cheerio = require('cheerio'); // node.js에서 제이쿼리 사용 가능하게 하는 모듈.

let title = '';

let pageNum = 1;

const run = (callback) => {
  axios.get('https://delryn.herokuapp.com/paging', {
    params: {
      page: Number(pageNum), // get 쿼리스트링 파라미터임.
    },
  })
    .then((res) => {
      const $ = cheerio.load(res.data); // HTML 데이터 제이쿼리로 읽게 해준다.
      const table = $('table > tbody  > tr > td');
      if (pageNum > 3) {
        callback();
      } else {
        table.each((idx, item) => {
          if (idx % 2 === 0) { // 제목만.
            title += `${$(item).text()}\n`;
          }
        });
        pageNum += 1;
        run(callback); // 재귀.
      }
    })
    .catch((err) => {
      callback(err);
    });
};

run((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(title);
  }
});
