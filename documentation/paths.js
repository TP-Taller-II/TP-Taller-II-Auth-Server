'use strict';

const usersSignUp = require('./users/sign_up');
const usersSignIn = require('./users/sign_in');
const usersSignOut = require('./users/sign_out');
const patchMe = require('./users/patch_me');
const getMe = require('./users/get_me');
const getById = require('./users/get_by_id');

module.exports = {
	paths: {
		'/v1/users/signUp': {
			...usersSignUp,
		},
		'/v1/users/SignIn': {
			...usersSignIn,
		},
		'/v1/users/signOut': {
			...usersSignOut,
		},
		'/v1/users/me': {
			...patchMe,
			...getMe,
		},
		'/v1/users/{id}': {
			...getById,
		},
	},
};
