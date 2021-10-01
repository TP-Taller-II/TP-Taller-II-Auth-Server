'use strict';

const usersSignUp = require('./users/sign_up');
const usersSignIn = require('./users/sign_in');
const usersSignOut = require('./users/sign_out');
const usersSignUpGoogle = require('./users/sign_up_google');
const usersSignInGoogle = require('./users/sign_in_google');
const patchMe = require('./users/patch_me');
const getMe = require('./users/get_me');
const getById = require('./users/get_by_id');

module.exports = {
	paths: {
		'/users/signUp': {
			...usersSignUp,
		},
		'users/SignIn': {
			...usersSignIn,
		},
		'/users/signUp/google': {
			...usersSignUpGoogle,
		},
		'users/SignIn/google': {
			...usersSignInGoogle,
		},
		'users/signOut': {
			...usersSignOut,
		},
		'users/me': {
			...patchMe,
			...getMe,
		},
		'users/{id}': {
			...getById,
		},
	},
};
