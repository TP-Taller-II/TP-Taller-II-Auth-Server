'use strict';

const express = require('express');
const { adminUsers } = require('../controllers/index');
const authenticateUser = require('../middleware/authenticate-user');

const router = express.Router();

router.post('/signIn', adminUsers.signIn);
router.post('/signOut', authenticateUser, adminUsers.signOut);
router.get('/users', authenticateUser, adminUsers.getAllUsersAsAdmin);
router.get('/users/:id', authenticateUser, adminUsers.getUserById);

module.exports = router;
