
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({region: 'ap-northeast-2'});

/**
 * TODO: 연결 해제
 * @description dynamodb에서 삭제함.
 */
exports.handler = async event => {
  const connectionId = event.requestContext.connectionId;
  const params = {
    TableName: 'my_chat',
    Key: {
      connection_id: connectionId,
    }
  };
  const result = {};
  try {
    await ddb.delete(params).promise();
    result.statusCode = 200;
    result.body = `연결 해제: ${connectionId}`;
    console.log('연결 해제', JSON.stringify(result));
  } catch (e) {
    result.statusCode = 500;
    result.body = `해제 실패: ${connectionId}`;
    console.log('해제 실패', JSON.stringify(result));
    console.log('err', JSON.stringify(e));
  }
  return result;
};

