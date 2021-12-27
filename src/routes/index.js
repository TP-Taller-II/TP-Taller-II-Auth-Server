'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const router = express.Router();

router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan('dev'));

const adminUsers = require('./admin-users');
const users = require('./users');
const status = require('./status');

router.use('/admin', adminUsers);
router.use('/users', users);
router.use('/status', status);

module.exports = router;
