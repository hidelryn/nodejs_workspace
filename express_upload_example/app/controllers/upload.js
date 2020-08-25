
const router = require('express').Router();
const mongoose = require('mongoose');
const upload = require('../lib/local_upload_util');

const UploadModel = mongoose.model('uploads');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/', (req, res, next) => {
  UploadModel.find((err, lists) => {
    if (err) return next(err);
    return res.render('list', {
      title: '업로드한 리스트',
      lists,
    });
  });
});

// 이미지 1개 업로드 (싱글)
router.get('/single', (req, res, next) => {
  res.render('single', {
    title: '이미지 1개 업로드 form',
  });
});

// 이미지 1개 업로드 (싱글) 처리
router.post('/single', (req, res, next) => {
  const uploadInit = upload.multerInit('images').single('attachment');
  uploadInit(req, res, (err) => {
    if (err) return next(err);
    const uploadData = new UploadModel({
      title: req.body.title,
      uploadImagePath: [upload.changeDBPath(req.file.path)],
      uploadImageName: [req.file.filename],
      imageOriginalName: [req.file.originalname],
    });
    return uploadData.save((saveErr) => {
      if (saveErr) return next(saveErr);
      return res.redirect('/');
    });
  });
});

// 이미지 여러개 업로드 (Array)
router.get('/array', (req, res, next) => {
  res.render('array', {
    title: '이미지 여러개 업로드 form',
  });
});

// 이미지 여러개 업로드 (Array) 처리
router.post('/array', (req, res, next) => {
  const uploadInit = upload.multerInit('images').array('attachment');
  uploadInit(req, res, (err) => {
    if (err) return next(err);
    const convertMulterData = upload.convertMulterData(req.files);
    if (!convertMulterData) return next(new Error('업로드된 파일들의 정보를 변환할 수 업음'));
    const uploadData = new UploadModel({
      title: req.body.title,
      uploadImagePath: convertMulterData.uploadPaths,
      uploadImageName: convertMulterData.fileName,
      imageOriginalName: convertMulterData.fileOriginalName,
    });
    return uploadData.save((saveErr) => {
      if (saveErr) return next(saveErr);
      return res.redirect('/');
    });
  });
});

// 지정된 이미지 input 업로드 (fields)
router.get('/fields', (req, res, next) => {
  res.render('fields', {
    title: '이미지 각각 테스트 form',
  });
});

// 이미지 각각 업로드 (fields) 처리
router.post('/fields', (req, res, next) => {
  const uploadInit = upload.multerInit('images').fields([{ name: 'attachment1', maxCount: 1 }, { name: 'attachment2', maxCount: 1 }]);
  uploadInit(req, res, (err) => {
    if (err) return next(err);
    const uploadData = new UploadModel({
      title: req.body.title,
      uploadImagePath: [upload.changeDBPath(req.files.attachment1[0].path), upload.changeDBPath(req.files.attachment2[0].path)],
      uploadImageName: [req.files.attachment1[0].filename, req.files.attachment2[0].filename],
      imageOriginalName: [req.files.attachment1[0].originalname, req.files.attachment2[0].originalname],
    });
    return uploadData.save((saveErr) => {
      if (saveErr) return next(saveErr);
      return res.redirect('/');
    });
  });
});

router.get('/download', (req, res, next) => {
  // eslint-disable-next-line no-underscore-dangle
  UploadModel.findOne({ _id: req.query._id }, (err, data) => {
    if (err) return next(err);
    if (data.uploadImagePath.length === 1) { // NOTE: 업로드 한개는 그냥 바로 다운로드.
      res.cookie('isDownload', 'complete', { // NOTE: 로딩 바를 위한 쿠키 값.
        maxAge: 10000,
      });
      res.setHeader('Content-disposition', 'attachment'); // NOTE: 컨텐츠 타입 첨부파일로 설정.
      return res.download(upload.changeUploadPath(data.uploadImagePath[0]), data.imageOriginalName[0]);
    }
    return upload.zipDownload(data.uploadImagePath, data.imageOriginalName).then((result) => {
      res.cookie('isDownload', 'complete', { // NOTE: 로딩 바를 위한 쿠키 값.
        maxAge: 10000,
      });
      res.setHeader('Content-disposition', 'attachment'); // NOTE: 컨텐츠 타입 첨부파일로 설정.
      return res.download(result);
    }).catch((zipDownloadErr) => next(zipDownloadErr));
  });
});
