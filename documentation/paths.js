'use strict';

const usersSignUp = require('./users/sign_up');
const usersSignIn = require('./users/sign_in');
const usersSignOut = require('./users/sign_out');
const patchMe = require('./users/patch_me');
const getMe = require('./users/get_me');
const getById = require('./users/get_by_id');

module.exports = {
	paths: {
		'/auth-server/v1/users/signUp': {
			...usersSignUp,
		},
		'/auth-server/v1/users/SignIn': {
			...usersSignIn,
		},
		'/auth-server/v1/users/signOut': {
			...usersSignOut,
		},
		'/auth-server/v1/users/me': {
			...patchMe,
			...getMe,
		},
		'/auth-server/v1/users/{id}': {
			...getById,
		},
	},
};
