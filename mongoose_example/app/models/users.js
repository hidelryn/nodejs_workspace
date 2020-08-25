
'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({ // 유저 스키마 정의
    userName: {
        type: String,
        required: [true, '선수 이름은 필수입니다.'] // 필수 값 validation
    },
    userNum: {
        type: Number,
        required: [true, '등번호는 필수입니다.'] // 필수 값 validation
    },
    position: String,
    userMail: String,
    team: {
        type: Schema.Types.ObjectId, // populate를 이용하기 위한 타입 처리
        ref: 'teams'
    },
    createAt: {
        type: Date,
        default: Date.now() // 기본 값 오늘날짜로 설정
    }
});

module.exports = mongoose.model('users', userSchema);