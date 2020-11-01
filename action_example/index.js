const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});

const USER_ID = "1q2w3e";
const GET_USER_QUERY = "SELECT * FROM UserActivePoint WHERE user_id = ?";
const UPDATE_USER_QUERY =
  "UPDATE UserActivePoint SET last_update_ts = ?, active_point = ? WHERE user_id = ?";
const CHARGE_TIME = 60 * 1000; // 충전 쿨타임 단위는 ms
const MAX_ACTIVE_POINT = 5;

app.get("/", (req, res) => {
  const now = Date.now();
  connection.query(GET_USER_QUERY, [USER_ID], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return connection.query(
        "INSERT INTO UserActivePoint(user_id, last_update_ts, active_point) VALUES (?, ?, ?)",
        [USER_ID, 0, 5],
        (err) => {
          if (err) throw err;
          return res.send(
            JSON.stringify({
              code: 200,
              active_point: 5,
              last_update_ts: 0,
              server_ts: now,
            })
          );
        }
      );
    }
    const activePointCalculate = activePointMiddleWare(
      results[0].active_point,
      results[0].last_update_ts,
    );
    return connection.query(
      UPDATE_USER_QUERY,
      [activePointCalculate.last_update_ts, activePointCalculate.active_point, USER_ID],
      (err) => {
        if (err) throw err;
        const now = Date.now();
        return res.send(
          JSON.stringify({
            code: 200,
            active_point: activePointCalculate.active_point,
            last_update_ts: activePointCalculate.last_update_ts,
            server_ts: now,
          })
        );
      }
    );
  });
});

app.get("/use", (req, res) => {
  connection.query(GET_USER_QUERY, [USER_ID], (err, results) => {
    if (err) throw err;
    if (results[0].active_point === 0)
      return res.send(JSON.stringify({ code: 400 }));
    const now = Date.now();
    const activePointCalculate = activePointMiddleWare(
      results[0].active_point,
      (results[0].last_update_ts > 0) ? results[0].last_update_ts : now,
    );
    connection.query(
      UPDATE_USER_QUERY,
      [activePointCalculate.last_update_ts, activePointCalculate.active_point - 1, USER_ID],
      (err) => {
        if (err) throw err;
        return res.send(
          JSON.stringify({
            code: 200,
            active_point: activePointCalculate.active_point - 1,
            last_update_ts: activePointCalculate.last_update_ts,
            server_ts: now,
          })
        );
      }
    );
  });
});

/**
 * 서버에서 충전한 시간 또는 클라에서 사용한 시간을 이용하여 충전해줘야 할 행동력을 계산
 * @param {Number} active_point 보유한 행동력
 * @param {Number} last_update_ts 사용했었던 시간 또는 충전해줬었던 시간 (=단위는 ms)
 */
function activePointMiddleWare(active_point, last_update_ts) {
  const now = Date.now();
  const results = {
    active_point,
    last_update_ts,
  };
  const chargeActionCount = Math.floor(
    (now - results.last_update_ts) / CHARGE_TIME
  ); // 충전 해줘야 하는 행동력 개수
  if (chargeActionCount > 0) {
    results.active_point += chargeActionCount;
    results.last_update_ts += (chargeActionCount * CHARGE_TIME);
  }
  if (chargeActionCount > 0 && results.active_point >= MAX_ACTIVE_POINT) { // 충전했을 시 최대 개수가 넘으면
    results.active_point = MAX_ACTIVE_POINT;
    results.last_update_ts = 0;
  }
  // console.log("results", results);
  return results;
}

app.listen(3000, () => console.log("서버 동작중"));
