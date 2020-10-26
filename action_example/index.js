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
const USER_QUERY = "SELECT * FROM user_action WHERE user_id = ?";
const CHARGE_TIME = 60 * 1000; // ms

app.get("/", (req, res) => {
  const now = Date.now();
  connection.query(USER_QUERY, [USER_ID], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return connection.query(
        "INSERT INTO user_action(user_id, last_update_time, action_count) VALUES (?, ?, ?)",
        [USER_ID, 0, 5],
        (err) => {
          if (err) throw err;
          return res.send(
            JSON.stringify({
              code: 200,
              action_count: 5,
              last_update_time: 0,
              server_time: now,
            })
          );
        }
      );
    }
    const calculate = recoverAction(
      results[0].action_count,
      results[0].last_update_time
    );
    return connection.query(
      "UPDATE user_action SET last_update_time = ?, action_count = ? WHERE user_id = ?",
      [calculate.now, calculate.count, USER_ID],
      (err) => {
        if (err) throw err;
        const now = Date.now();
        return res.send(
          JSON.stringify({
            code: 200,
            action_count: calculate.count,
            last_update_time: calculate.now,
            server_time: now,
          })
        );
      }
    );
  });
});

app.get("/use", (req, res) => {
  connection.query(USER_QUERY, [USER_ID], (err, results) => {
    if (err) throw err;
    if (results[0].action_count === 0)
      return res.send(JSON.stringify({ code: 400 }));
    const calculate = recoverAction(
      results[0].action_count,
      results[0].last_update_time
    );
    connection.query(
      "UPDATE user_action SET last_update_time = ?, action_count = ? WHERE user_id = ?",
      [calculate.now, calculate.count - 1, USER_ID],
      (err) => {
        if (err) throw err;
        const now = Date.now();
        return res.send(
          JSON.stringify({
            code: 200,
            action_count: calculate.count - 1,
            last_update_time: calculate.now,
            server_time: now,
          })
        );
      }
    );
  });
});

function recoverAction(action_count, last_update_time) {
  // 지난 사용 시간을 이용하여 충전해야 할 행동력 계산
  const now = Date.now();
  const lastUpdateTime = last_update_time > 0 ? last_update_time : now;
  const chargeActionCount = Math.floor((now - lastUpdateTime) / CHARGE_TIME);
  const addCount = action_count + chargeActionCount;
  const totalCount = addCount >= 5 ? 5 : addCount;
  let updateTime = lastUpdateTime;
  if (chargeActionCount > 0) updateTime = now;
  if (totalCount === 5) updateTime = 0;
  return { count: totalCount, now: updateTime };
}

app.listen(3000, () => console.log("서버 동작중"));
