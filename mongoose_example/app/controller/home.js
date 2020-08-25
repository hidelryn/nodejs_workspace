
'use strict';

const express = require('express');
const router = express.Router();
const userModel = require('../models/users');
const teamModel = require('../models/teams');


router.get('/', (req, res) => {
    res.send('hihi');
});

// @TODO: 1 document 생성
router.get('/create', (req, res) => {
    let user = new userModel({
        userName: '크리스티아누 날강두',
        userNum: 7,
        position: '공격수',
        userMail: '날강두@유벤투스.com',
        team: '5d4c412caf60c707c225565d'
    });

    user.save((err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

// @TODO: 2개 이상의 document를 생성.
router.get('/manyCreate', (req, res) => {
    let users = [
        {
            userName: '모하메드 살라',
            userNum: 11,
            position: '공격수',
            team: '5d4c412caf60c707c225565e',
            userMail: '이집트메시@리버풀.com'
        },
        {
            userName: '피에르에메릭 오바메양',
            userNum: 17,
            position: '공격수',
            team: '5d4c412caf60c707c225565f',
            userMail: '득점왕@아스날.com'
        },
        {
            userName: '메수트 외질',
            userNum: 11,
            position: '미드필더',
            team: '5d4c412caf60c707c225565f',
            userMail: '노랑머리@아스날.com'
        }
    ];
    userModel.insertMany(users, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

// @TODO: mongoose validation
router.get('/validation', (req, res) => {
    var user = new userModel({
        userName: '해리 맥과이어',
        userNum: null,
        position: '수비수',
        userMail: '비싼몸@맨유.com'
    });
    let validateErr = user.validateSync(); // err return
    user.save((err, result) => {
        if (err) {
            res.json(err);
        } else if (result && !validateErr) {
            res.json(result);
        } else {
            res.json(validateErr);
        }
    });
});

// @TODO: 조회 {} 오브젝트 안에 조건이 들어감.
router.get('/find', (req, res) => {
    userModel.find({}, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: 특정 필드만 읽고 싶을 때.
router.get('/find-attr', (req, res) => {
    userModel.find({}).select('userName userMail')
        .exec((err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            }
        });
});

// @TODO: 조건절 예시 아래는 or
router.get('/or', (req, res) => {
    userModel.find({
        $or: [{ userName: '메수트 외질' }, { userName: '크리스티아누 날강두' }]
    }).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});


// @TODO: 조건으로 정규식 사용, sql like과 같은 기능.
router.get('/regex', (req, res) => {  
    userModel.find({ userName: { $regex: new RegExp('날강두', 'i') } }).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: 개수 제한.
router.get('/limit', (req, res) => {
    userModel.find({}).limit(2).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: 해당 숫자만큼 건너뛰고 조회 결과 리턴.
router.get('/skip', (req, res) => {
    userModel.find({}).skip(2).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: 정렬. 필드: 1이면 오름차순, 필드: -1이면 내림차순.
// {필드: 1, 필드: -1} 이면 앞에 꺼 부터 먼저 정렬 후 그 뒤에 다음 정렬.
router.get('/sort', (req, res) => {
    userModel.find({}).sort({ id: 1 }).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: 조건에 맞는 데이터 조회 해서 첫 번째 문서만 리턴.
router.get('/findOne', (req, res) => {
    userModel.findOne({ userName: '크리스티아누 날강두' }, (err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: 문서 업데이트 하기
// findOne에서만 가능한 방법.
router.get('/update1', (req, res) => {
    userModel.findOne({ userName: '크리스티아누 날강두' }, (err, User) => {
        if (err) {
            res.json(err);
        } else if (!User) {
            res.json('데이터가 없습니다.');
        } else {
            User.position = '먹튀';
            User.save((err, UpdateUser) => {
                if (err) {
                    req.json(err);
                } else {
                    res.json(UpdateUser);
                }
            });
        }
    });
});

// @TODO: 통상적인 update
router.get('/update2', (req, res) => {
    userModel.updateOne(
        { userName: '크리스티아누 날강두' },
        { $set: { userMail: '먹튀@유벤투스.com' } },
        (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json('update success');
            }
        });
});

// @TODO: 통상적인 update
router.get('/update3', (req, res) => {
    userModel.updateMany(
        { position: '공격수' },
        { $set: { userNum: 999 } },
        (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json('update success');
            }
        });
});

// @TODO: 데이터를 조회 후 update 한번에.
router.get('/update4', (req, res) => {
    userModel.findOneAndUpdate(
        { userName: '크리스티아누 날강두' },
        { $set: { userMail: '예전우리형@유벤투스.com' } },
        { new: true }, // new: true를 꼭 적어줘야 결과 반환이 됨
        (err, data) => {
            if (err) {
                res.json(err);
            } else {
                res.json(data);
            }
        });
});

// @TODO: 조건에 맞는 첫 번째 문서를 삭제할 때. 새로 생겻군...
router.get('/deleteOne', (req, res) => {
    userModel.deleteOne({ userName: '크리스티아누 날강두' }, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.json('삭제됨.');
        }
    });
});

// @TODO: 조건에 맞는 여러 데이터를 삭제 할 때. 이거도 마찬가지로 새로 생겻구먼..
router.get('/deleteMany', (req, res) => {
    userModel.deleteMany({}, (err) => {
        if (err) {
            res.json(err);
        } else {
            res.json('삭제됨.');
        }
    });
});

// @TODO: populate로 join 하는 법
// userModel의 objectId로 타입을 정의한 team 프로퍼티
router.get('/populate', (req, res) => {
    userModel.find({}).populate('team').exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// @TODO: lookup을 통한 join
router.get('/lookup', (req, res) => {
    teamModel.aggregate([
        // {
        //     "$match": { // 조건절
        //         "teamName": '아스날'
        //     }
        // },
        {
            "$sort": {
                "_id": 1
            }
        },
        {
            "$lookup": {
                "localField": "_id",
                "from": "users",
                "foreignField": "team",
                "as": "users"
            }
        }
    ]).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

// unwind
router.get('/unwind', (req, res) => {
    teamModel.aggregate([
        {
            "$sort": {
                "_id": 1
            }
        },
        {
            "$lookup": {
                "localField": "_id",
                "from": "users",
                "foreignField": "team",
                "as": "users"
            }
        },
        { "$unwind": "$users" }
    ]).exec((err, data) => {
        res.json(data);
    });
});

// @TODO: 그룹핑 하는 법
router.get('/group', (req, res) => {
    userModel.aggregate([
        {
            "$group": { // 고정된 형식.
                "_id": { "position": "$position" }, // { 'alias ( 결과 필드명 )': '$사용할 필드명' }
                "count": { "$sum": 1 } // 집계 메소드 따로 Count가 업음.
            }
        }
    ]).exec((err, data) => {
        if (err) {
            res.json(err);
        } else {
            res.json(data);
        }
    });
});

router.get('/dummy', (req, res) => {
    let teams = [
        {
            teamName: '유벤투스'
        },
        {
            teamName: '리버풀'
        },
        {
            teamName: '아스날'
        }
    ];
    teamModel.insertMany(teams, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});


module.exports = router;