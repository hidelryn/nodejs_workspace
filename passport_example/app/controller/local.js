
const express = require('express');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const UserModel = mongoose.model('users');

const security = require('../lib/security');

const router = express.Router();

module.exports = (app) => {
  app.use('/', router);
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  const data = user;
  delete data.password;
  done(null, data);
});

// local Strategy 세팅
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  UserModel.findOne({
    email: security.xssFilter(email),
    password: security.changeHash(password),
  }, (err, data) => {
    if (err) { return done(err); }
    if (!data) {
      return done(null, false, 'Either no registered email address or the password is incorrect.');
    }
    return done(null, data);
  });
}));


router.get('/', security.csrfProtection(), (req, res) => {
  res.render('index', {
    csrfToken: req.csrfToken(),
  });
});

// TODO: 가입 처리.
// eslint-disable-next-line consistent-return
router.post('/signUp', security.csrfProtection(), (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(200).json({ result: false, title: 'warning', comment: 'email or password or name is omitted' });
  }
  UserModel.findOne({
    email: security.xssFilter(email),
    // eslint-disable-next-line consistent-return
  }, (err, data) => {
    if (err) { return next(err); }
    if (data) { return res.json({ result: false, title: 'warning', comment: 'This email has already been signed up.' }); }
    const user = new UserModel({
      email: security.xssFilter(email),
      password: security.changeHash(security.xssFilter(password)),
      name,
    });
    user.save((saveErr) => {
      if (saveErr) { return next(saveErr); }
      return res.status(200).json({ result: true, title: 'Your membership is complete', comment: 'Please sign in.' });
    });
  });
});

// TODO: 로그인 처리.
// eslint-disable-next-line no-unused-vars
router.post('/signIn', security.csrfProtection(), (req, res, next) => {
  // eslint-disable-next-line consistent-return
  passport.authenticate('local', (err, user, message) => {
    // console.log('user', user);
    // console.log('message', message);
    if (err) { return res.status(500).json(err); }
    if (!user) { return res.status(200).json({ result: false, title: 'error', comment: message }); }
    req.logIn(user, (sessionErr) => { // session init
      if (sessionErr) { return next(sessionErr); }
      return res.status(200).json({ result: true, title: 'success', comment: 'login complete' });
    });
  })(req, res, next);
});

// TODO: profile 페이지
router.get('/success', security.isLogin, (req, res) => {
  // console.log('req.user', req.user);
  res.render('profile', {
    profile: req.user,
  });
});

// TODO: 로그아웃 처리.
router.get('/logout', security.isLogin, (req, res) => {
  req.logout();
  res.redirect('/');
});
