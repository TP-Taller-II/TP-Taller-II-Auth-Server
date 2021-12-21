'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const status = require('../controllers/status');

const router = express.Router();

router.use(express.static('public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(morgan('dev'));

router.get('', status);

module.exports = router;
