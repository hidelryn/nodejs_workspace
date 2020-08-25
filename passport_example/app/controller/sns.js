const express = require('express');

const passport = require('passport');

const FacebookStrategy = require('passport-facebook').Strategy;

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const TwitterStrategy = require('passport-twitter').Strategy;

const mongoose = require('mongoose');

const UserModel = mongoose.model('users');

const security = require('../lib/security');

const config = require('../../config/config');

const router = express.Router();

module.exports = (app) => {
  app.use('/auth', router);
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  const data = user;
  delete data.password;
  done(null, data);
});


// TODO: 페이스북 처리.
passport.use(new FacebookStrategy({
  clientID: config.key.facebook.id,
  clientSecret: config.key.facebook.secret,
  callbackURL: config.key.facebook.url,
  profileFields: ['displayName', 'email', 'picture.type(large)'],
}, (accessToken, refreshToken, profile, done) => {
  UserModel.findOne({ email: profile.emails[0].value }, (err, data) => {
    if (err) { return done(err); }
    if (!data) {
      const user = new UserModel({
        email: profile.emails[0].value,
        password: security.randomHash(10),
        name: profile.displayName,
        image: profile.photos[0].value,
      });
      return user.save((saveErr, saveUser) => {
        if (saveErr) { return done(saveErr); }
        return done(null, saveUser);
      });
    }
    return done(null, data);
  });
}));

router.get('/facebook', passport.authenticate('facebook', { authType: 'rerequest', scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/',
}));

// TODO: 구글 처리
passport.use(new GoogleStrategy({
  clientID: config.key.google.id,
  clientSecret: config.key.google.secret,
  callbackURL: config.key.google.url,
}, (accessToken, refreshToken, profile, done) => {
  UserModel.findOne({ email: profile.emails[0].value }, (err, data) => {
    if (err) { return done(err); }
    if (!data) {
      const user = new UserModel({
        email: profile.emails[0].value,
        password: security.randomHash(10),
        name: profile.displayName,
        image: profile.photos[0].value,
      });
      return user.save((saveErr, saveUser) => {
        if (saveErr) { return done(saveErr); }
        return done(null, saveUser);
      });
    }
    return done(null, data);
  });
}));
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/success',
  failureRedirect: '/',
}));

// TODO: 트위터 처리.
passport.use(new TwitterStrategy({
  consumerKey: config.key.twitter.id,
  consumerSecret: config.key.twitter.secret,
  callbackURL: config.key.twitter.url,
  includeEmail: true,
}, (token, tokenSecret, profile, done) => {
  UserModel.findOne({ email: profile.emails[0].value }, (err, data) => {
    if (err) { return done(err); }
    if (!data) {
      const user = new UserModel({
        email: profile.emails[0].value,
        password: security.randomHash(10),
        name: profile.displayName,
        image: profile.photos[0].value,
      });
      return user.save((saveErr, saveUser) => {
        if (saveErr) { return done(saveErr); }
        return done(null, saveUser);
      });
    }
    return done(null, data);
  });
}));

router.get('/twitter', passport.authenticate('twitter'));
router.get('/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/success',
  failureRedirect: '/',
}));
