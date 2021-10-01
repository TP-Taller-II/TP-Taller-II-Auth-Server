'use strict';

console.log('Time:', Date.now());

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const router = express.Router();

router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan('dev'));

const users = require('./users');

router.use('/users', users);

module.exports = router;
