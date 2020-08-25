
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ region: 'ap-northeast-2' });

const TABLE_NAME = 'my_chat';

/**
 * TODO: 커넥션
 * @description Dynamodb에 해당 유저 ID, 커넥션 ID 담아둔다.
 */
exports.handler = async (event) => {
  const result = {};
  const connectionId = event.requestContext.connectionId;
  if (typeof event.queryStringParameters === 'undefined' || typeof event.queryStringParameters.user_id === 'undefined') {
    console.log('연결 실패', '유저 아이디가 없음');
    result.statusCode = 500;
    result.body = `연결 실패: ${connectionId}`;
    return result;
  }
  const userId = event.queryStringParameters.user_id;
  const checkParams = {
    TableName: TABLE_NAME,
    IndexName: 'user_id-index',
    KeyConditionExpression: '#user_id = :user_id',
    ExpressionAttributeNames: {
      '#user_id': 'user_id',
    },
    ExpressionAttributeValues: {
      ':user_id': userId,
    },
  };
  const putParams = {
    TableName: TABLE_NAME,
    Item: {
      connection_id: connectionId,
      user_id: userId,
    },
  };
  try {
    const duplicateCheck = await ddb.query(checkParams).promise();
    if (duplicateCheck.Items.length > 0) { // NOTE: 만약에 중복된 유저가 접속이 되는 경우..?
      const del = [];
      duplicateCheck.Items.forEach((key) => {
        const delParams = {
          TableName: TABLE_NAME,
          Key: {
            connection_id: key.connection_id,
          }
        };
        del.push(ddb.delete(delParams).promise());
        Promise.all(del);
      });
    }
    await ddb.put(putParams).promise();
    result.statusCode = 200;
    result.body = `연결 성공: ${connectionId}`;
    console.log('연결 완료', JSON.stringify(result));
  } catch (e) {
    result.statusCode = 500;
    result.body = `연결 실패: ${connectionId}`;
    console.log('연결 실패', JSON.stringify(result));
    console.log('err', JSON.stringify(e));
  }
  return result;
};