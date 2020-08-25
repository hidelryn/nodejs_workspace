const AWS = require('aws-sdk');

AWS.config.update({
  region: '', // 리전
  accessKeyId: '', // IAM
  secretAccessKey: '' // IAM
});

const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.handler = async (event) => {
  const body = JSON.parse(event.Records[0].body);
  const receiptHandle = event.Records[0].receiptHandle;
  console.log('body', body);
  console.log('receiptHandle', receiptHandle);
  const putParams = {
    TableName: 'receive',
    Item: {
      id: body.id,
      timestamp: body.ts,
      message: body.message,
    },
  };
  const sqsParams = {
    QueueUrl: 'SQS에서 발급하는 URL',
    ReceiptHandle: receiptHandle,
  }
  try {
    await Promise.all([
      ddb.put(putParams).promise(),
      sqs.deleteMessage(sqsParams).promise(),
    ]);
    const response = {
      statusCode: 200,
      body: JSON.stringify('receive success'),
    };
    return response;
  } catch (e) {
    console.log('e', e);
    const response = {
      statusCode: 500,
      body: JSON.stringify('receive err'),
    };
    return response;
  }
};