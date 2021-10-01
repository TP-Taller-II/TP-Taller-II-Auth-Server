'use strict';

const usersSignUp = require('./users/sign_up');
const usersSignIn = require('./users/sign_in');
const usersSignOut = require('./users/sign_out');
const usersSignUpGoogle = require('./users/sign_up_google');
const usersSignInGoogle = require('./users/sign_in_google');
const patchMe = require('./users/patch_me');
const getMe = require('./users/get_me');
const getById = require('./users/get_by_id');
const createFileShareRequest = require('./users/create_file_share_request');
const getFileShareAcceptRequest = require('./users/get_file_share_accept_request');
const postFile = require('./files/post');
const list = require('./files/list');
const getFile = require('./files/get_file');
const deleteFile = require('./files/delete_file');
const deleteDirectory = require('./files/delete_directory');
const getTree = require('./files/get_tree');

module.exports = {
	paths: {
		'/users/signUp': {
			...usersSignUp
		},
		'users/SignIn': {
			...usersSignIn
		},
		'/users/signUp/google': {
			...usersSignUpGoogle
		},
		'users/SignIn/google': {
			...usersSignInGoogle
		},
		'users/signOut': {
			...usersSignOut
		},
		'users/me': {
			...patchMe,
			...getMe
		},
		'users/{id}': {
			...getById
		},
		'users/fileShareRequest': {
			...createFileShareRequest
		},
		'users/fileShareAccept/Request/:id': {
			...getFileShareAcceptRequest
		},
		'files/': {
			...postFile,
			...list
		},
		'files/file': {
			...getFile,
			...deleteFile
		},
		'files/tree': {
			...getTree
		},
		'files/directory': {
			...deleteDirectory
		}
	}
};
