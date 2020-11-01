const readline = require("readline");

const { GoogleSpreadsheet } = require("google-spreadsheet");

const mysql = require("mysql2");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});

async function main() {
  const doc = new GoogleSpreadsheet(
    ""
  );
  doc.useApiKey("");
  try {
    await doc.loadInfo();
  } catch (e) {
    console.log("잘못된 시트 ID 입니다.");
    close();
  }
  let sheetName;
  try {
    sheetName = await question(
      "SQL에 삽입/수정 할 시트명을 입력해주세요 : ",
      "시트명이 입력되지 않았습니다."
    );
  } catch (e) {
    console.log(e);
    close();
  }
  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    console.log("존재 하지 않은 시트 입니다.");
    close();
  }
  const rows = await sheet.getRows();
  const headers = rows[0]["_sheet"].headerValues;
  const exceptIndex = [];
  headers.forEach((header, idx) => {
    const check = isKorean(header, idx);
    if (check > 0) exceptIndex.push(idx);
  });
  console.log('exceptIndex', exceptIndex);
  console.log(headers);
  // console.log(rows[0]);
  // console.log(rows[0].value);
}

function question(message, cancel) {
  return new Promise((resolve, reject) => {
    rl.question(message, (answer) => {
      if (!answer) return reject(cancel);
      return resolve(answer);
    });
  });
}

function close() {
  process.exit(1);
}

function isKorean(ch, index) {
  const c = ch.charCodeAt(0);
  if (0x1100 <= c && c <= 0x11ff) return index;
  if (0x3130 <= c && c <= 0x318f) return index;
  if (0xac00 <= c && c <= 0xd7a3) return index;
  return -1;
}

main();
