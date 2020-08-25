
const AWS = require('aws-sdk');

AWS.config.update({
  region: '',
  accessKeyId: '', // IAM
  secretAccessKey: '', // IAM
});

const ses = new AWS.SESV2();

const html = '<h1 style="color:aqua;">반갑습니다</h1>';

const text = '안녕하세요?';

const params = {
  Content: {
    Simple: {
      Body: { // NOTE: 메일 본문
        // Html: { // NOTE: HTML인 경우
        //   Data: html,
        //   Charset: 'utf-8', // 인코딩
        // },
        Text: { // NOTE: 일반 텍스트의 경우
          Data: text,
          Charset: 'utf-8',
        },
      },
      Subject: { // NOTE: 메일 제목
        Data: '기획안 전달 드립니다.',
        Charset: 'utf-8',
      },
    },
  },
  Destination: {
    BccAddresses: [], // NOTE: 숨은 참조 리스트
    CcAddresses: [], // NOTE: 참조 리스트
    ToAddresses: ['delryn@naver.com'], // NOTE: 수신 할 메일 주소 리스트
  },
  FromEmailAddress: '"delryn" <hidelryn@gmail.com>', // NOTE: 발송 하는 메일 주소
  ReplyToAddresses: [], // 답장 받을 이메일 주소
};

ses.sendEmail(params, (err) => {
  if (err) console.log('err', err);
  console.log('메일 전송 성공!');
});