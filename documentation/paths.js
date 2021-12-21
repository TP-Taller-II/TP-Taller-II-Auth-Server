'use strict';

const usersSignUp = require('./users/sign_up');
const usersSignIn = require('./users/sign_in');
const usersSignOut = require('./users/sign_out');
const patchMe = require('./users/patch_me');
const getMe = require('./users/get_me');
const getById = require('./users/get_by_id');
const adminUsersSignIn = require('./admin-users/sign_in');
const adminUsersSignOut = require('./admin-users/sign_out');
const getByIdAsAdmin = require('./admin-users/get_by_id');
const getAllUsers = require('./admin-users/get_all_users');
const getAdminById = require('./admin-users/get_admin_by_id');
const status = require('./status/status');

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
		'/auth-server/v1/admin/SignIn': {
			...adminUsersSignIn,
		},
		'/auth-server/v1/admin/signOut': {
			...adminUsersSignOut,
		},
		'/auth-server/v1/admin/users/{id}': {
			...getByIdAsAdmin,
		},
		'/auth-server/v1/admin/users': {
			...getAllUsers,
		},
		'/auth-server/v1/admin/{id}': {
			...getAdminById,
		},
		'/auth-server/v1/status': {
			...status,
		},
	},
};
