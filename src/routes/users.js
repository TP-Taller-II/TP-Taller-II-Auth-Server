'use strict';

const express = require('express');
const { users } = require('../controllers/index');
const authenticateUser = require('../middleware/authenticate-user');

const router = express.Router();

router.post('/signUp', users.signUp);
router.post('/signIn', users.signIn);
router.post('/signOut', authenticateUser, users.signOut);
router.get('/me', authenticateUser, users.getMe);
router.get('/:id', authenticateUser, users.getUserById);
router.patch('/me', authenticateUser, users.updateUser);

module.exports = router;
