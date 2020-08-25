
'use strict';

const express = require('express');

const mongoose = require('mongoose');

const app = express();

const PORT = 3000;

const home = require('./app/controller/home');

app.use('/', home);
app.set('json spaces', 2);

mongoose.Promise = global.Promise;
const mongodb = mongoose.connect('mongodb://localhost:27017/localtest', {
    useNewUrlParser: true,
    useFindAndModify: false
});

mongodb.then(() => {
    console.log('mongodb has been connected');
}).catch((err) => {
    console.log('mongodb connect err', err);
});

app.listen(PORT, () => {
    console.log(`express is running on port ${PORT}`);
});