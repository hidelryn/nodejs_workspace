
const fs = require('fs');

const data = [];

const responseData = (requestParams, response, context, ee, next) => {
  const json = JSON.parse(response.body);
  if (json.code === 200) {
    data.push({ id: json.id });
  }
  fs.writeFile('ids.json', JSON.stringify(data), (e) => {
    return next();
  });
};

let i = 0;

const setParam = (context, events, done) => {
   context.vars['id'] = data[i].id;
   i++;
   return done();
}

exports.responseData = responseData;
exports.setParam = setParam;