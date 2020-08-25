
const path = require('path');

const ROOT = path.dirname(require.main.filename);

const ENV = process.env.NODE_ENV || 'local';

const config = {
  local: {
    root: ROOT,
    appName: 'auth-local-server',
    port: process.env.PORT || 3000,
    mongo: 'mongodb://localhost:27017/user',
    redis: {
      host: 'localhost',
      port: 6379,
    },
    key: {
      facebook: {
        id: process.env.FACEBOOK_APP_ID,
        secret: process.env.FACEBOOK_APP_SECRET,
        url: '',
      },
      google: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        url: '',
      },
      twitter: {
        id: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_SECRET_KEY,
        url: '',
      },
    },
  },
  development: {
    root: ROOT,
    appName: 'auth-development-server',
    port: process.env.PORT || 3000,
    mongo: '',
    redis: {
      host: '',
      port: 6379,
    },
    key: {
      facebook: {
        id: process.env.FACEBOOK_APP_ID,
        secret: process.env.FACEBOOK_APP_SECRET,
        url: '',
      },
      google: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        url: '',
      },
      twitter: {
        id: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_SECRET_KEY,
        url: '',
      },
    },
  },
  staging: {
    root: ROOT,
    appName: 'auth-staging-server',
    port: process.env.PORT || 3000,
    mongo: '',
    redis: {
      host: '',
      port: 6379,
    },
    key: {
      facebook: {
        id: process.env.FACEBOOK_APP_ID,
        secret: process.env.FACEBOOK_APP_SECRET,
        url: '',
      },
      google: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        url: '',
      },
      twitter: {
        id: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_SECRET_KEY,
        url: '',
      },
    },
  },
  production: {
    root: ROOT,
    appName: 'auth-production-server',
    port: process.env.PORT || 3000,
    mongo: '',
    redis: {
      host: '',
      port: 6379,
    },
    key: {
      facebook: {
        id: process.env.FACEBOOK_APP_ID,
        secret: process.env.FACEBOOK_APP_SECRET,
        url: '',
      },
      google: {
        id: process.env.GOOGLE_CLIENT_ID,
        secret: process.env.GOOGLE_CLIENT_SECRET,
        url: '',
      },
      twitter: {
        id: process.env.TWITTER_API_KEY,
        secret: process.env.TWITTER_SECRET_KEY,
        url: '',
      },
    },
  },
};

module.exports = config[ENV];
