'use strict';

const express = require('express');
const { adminUsers } = require('../controllers/index');
const authenticateUser = require('../middleware/authenticate-user');
const authenticateAdminUser = require('../middleware/authenticate-admin-user');

const router = express.Router();

router.post('/signIn', adminUsers.signIn);
router.post('/signOut', authenticateUser, authenticateAdminUser, adminUsers.signOut);
router.get('/users', authenticateUser, authenticateAdminUser, adminUsers.getAllUsersAsAdmin);
router.get('/users/:id', authenticateUser, authenticateAdminUser, adminUsers.getUserById);
router.get('/:id', authenticateUser, adminUsers.userIsAdmin);

module.exports = router;
