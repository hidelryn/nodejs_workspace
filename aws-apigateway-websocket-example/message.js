const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient({ region: 'ap-northeast-2' });

const TABLE_NAME = 'my_chat';

/**
 * TODO: 메세지 전송
 */
exports.handler = async event => {
  const result = {};
  let connectionData;
  try {
    connectionData = await ddb.scan({ TableName: TABLE_NAME }).promise(); // NOTE: 모든 커넥션 ID를 가지고 온다.
  } catch (e) {
    result.statusCode = 500;
    result.body = '연결된 아이디를 가지고 올 수가 없다';
    return result;
  }
  
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage,
    region: 'ap-northeast-2'
  });
  
  const message = JSON.parse(event.body).message;
  
  const postCalls = connectionData.Items.map(async ({ connection_id, user_id }) => {
    try {
      const post = {
        connection_id,
        user_id,
        message,
      };
      console.log('post', JSON.stringify(post));
      await apigwManagementApi.postToConnection({ ConnectionId: connection_id, Data: JSON.stringify(post) }).promise(); // NOTE: 메세지 전송
    } catch (e) {
      if (e.statusCode === 410) { // NOTE: 연결 끊긴 커넥션 ID는 삭제
        console.log(`deleting ${user_id}`);
        await ddb.delete({ TableName: TABLE_NAME, Key: { connection_id } }).promise();
      }
      console.log('e', e.stack);
    }
  });
  
  try {
    await Promise.all(postCalls);
    result.statusCode = 200;
    result.body = '메세지 전송 성공';
  } catch (e) {
    result.statusCode = 500;
    result.body = '메세지 전송 실패';
  }
  return result;
};