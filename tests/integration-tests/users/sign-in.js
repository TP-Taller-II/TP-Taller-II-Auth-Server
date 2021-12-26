'use strict';

const axios = require('axios');
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();
const Bcrypt = require('bcrypt');

const { TokenServices } = require('../../../src/services');
const Model = require('../../../src/databases/mongodb/model');
const STATUS_CODES = require('../../../src/utils/status-codes.json');

process.env.PORT = 3030;

const app = require('../../../src');

chai.use(chaiHttp);

describe('Users', async () => {

	beforeEach(() => {
		process.env.PORT = 3030;
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	const fakeEmailUser = {
		_id: '60456ebb0190bf001f6bbee2',
		name: 'Userfirstname',
		surname: 'Userlastname',
		email: 'some.email@hotmail.com',
		password: '$2b$10$FVLh9oI6betv13edzE9cQuNbXVFqTu3pp3MfKP9mp9Uv/rVXQuDf6',
		provider: 'email',
		profilePic: 'https://firebasestorage.googleapis.com/v0/b/tddrive-b11e3.appspot.com/o/8a909882b3c6a2fcba6e1d4a42dabd42.jpg',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};

	const fakeGoogleUserRequest = {
		googleIdToken: 'some-jwt',
		provider: 'google',
	};

	const fakeGoogleUser = {
		_id: '60456ebb0190bf001f6bbee3',
		name: 'Some Names',
		surname: 'Asurname',
		email: 'some.google.email@fi.uba.ar',
		provider: 'google',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};


	const googleUserValidationResponse = {
		iss: 'https://accounts.google.com',
		azp: '366042836893-sr73u41cc1sam1vijfsm4pni4g5uvkhk.apps.googleusercontent.com',
		aud: '366042836893-sr73u41cc1sam1vijfsm4pni4g5uvkhk.apps.googleusercontent.com',
		sub: '111295581994168358240',
		hd: 'fi.uba.ar',
		email: 'some.google.email@fi.uba.ar',
		email_verified: 'true',
		at_hash: 'Xh97KS3jRcqGQocjui1B2g',
		name: 'Some Names Asurname',
		picture: 'https://lh3.googleusercontent.com/a/AATXAJy6KzR-znL2fTpQThweW5RZS76RcPBSU5bAQ2mm=s96-c',
		given_name: 'Some Names',
		family_name: 'Asurname',
		locale: 'es',
		iat: '1639959993',
		exp: '1639963593',
		alg: 'RS256',
		kid: 'd98f49bc6ca4581eae8dfadd494fce10ea23aab0',
		typ: 'JWT',
	};

	describe('Sign in', async () => {

		it('Should set status code 400 when user is not found', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeEmailUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid email' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeEmailUser.email);
		});

		it('Should set status code 400 when email password is wrong', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeEmailUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(false);
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeEmailUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid email or password' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeEmailUser.email);
			sandbox.assert.calledOnce(Bcrypt.compare);
			sandbox.assert.notCalled(TokenServices.prototype.generateToken);
			sandbox.assert.notCalled(Model.prototype.update);
		});

		it('Should set status code 200 when user is valid', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeEmailUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(true);
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeEmailUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			const { password, ...formattedUser } = fakeEmailUser;
			assert.deepStrictEqual(res.body, { ...formattedUser, accessToken: 'fakeToken' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeEmailUser.email);
			sandbox.assert.calledOnce(Bcrypt.compare);
			sandbox.assert.calledOnce(TokenServices.prototype.generateToken);
			sandbox.assert.calledOnce(Model.prototype.update);
		});

		it('Should set status code 500 when database fails', async () => {

			sandbox.stub(Model.prototype, 'findBy').rejects(new Error('DB ERROR'));

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeEmailUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should set status code 400 when the passwords don\'t match', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeEmailUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(false);
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send({ ...fakeEmailUser, password: 'notcorrect' });
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid email or password' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeEmailUser.email);
			sandbox.assert.calledOnce(Bcrypt.compare);
			sandbox.assert.notCalled(TokenServices.prototype.generateToken);
			sandbox.assert.notCalled(Model.prototype.update);
		});

		it('Should set status code 400 when provider is not valid', async () => {

			const user = { ...fakeEmailUser, provider: 'nonexistent' };

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(user);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid provider: nonexistent' });
		});

		it('Should set status code 400 when provider is not set', async () => {

			const user = { ...fakeEmailUser, provider: undefined };

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(user);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid provider: undefined' });
		});

		it('Should set status code 400 when Google idToken validation fails', async () => {

			sandbox.stub(axios, 'get')
				.withArgs(`https://oauth2.googleapis.com/tokeninfo?id_token=${fakeGoogleUserRequest.googleIdToken}`)
				.rejects({ message: 'Some Error' });

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeGoogleUserRequest);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Error validating Google idToken.' });

			sandbox.assert.calledOnce(axios.get);
		});

		it('Should set status code 200 when a new Google user is created', async () => {

			sandbox.stub(axios, 'get')
				.withArgs(`https://oauth2.googleapis.com/tokeninfo?id_token=${fakeGoogleUserRequest.googleIdToken}`)
				.resolves({ data: googleUserValidationResponse });
			sandbox.stub(Model.prototype, 'findBy').resolves([]);
			sandbox.stub(Model.prototype, 'create').resolves({ ...fakeGoogleUser, provider: 'google' });
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeGoogleUserRequest);
			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body, { ...fakeGoogleUser, accessToken: 'fakeToken' });

			const modelCreateObject = {
				name: googleUserValidationResponse.given_name,
				surname: googleUserValidationResponse.family_name,
				email: googleUserValidationResponse.email,
				profilePic: googleUserValidationResponse.picture,
				provider: 'google',
			};
			sandbox.assert.calledOnce(axios.get);
			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeGoogleUser.email);
			sandbox.assert.calledOnceWithExactly(Model.prototype.create, modelCreateObject);
			sandbox.assert.calledOnce(TokenServices.prototype.generateToken);
			sandbox.assert.calledOnce(Model.prototype.update);
		});

		it('Should set status code 400 when trying to sign in using Google with a user that was registered with scope "email"', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeEmailUser]);
			sandbox.stub(axios, 'get')
				.withArgs(`https://oauth2.googleapis.com/tokeninfo?id_token=${fakeGoogleUserRequest.googleIdToken}`)
				.resolves({ data: googleUserValidationResponse });

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeGoogleUserRequest);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'The email is already used without registering with Google.' });

			sandbox.assert.calledOnce(axios.get);
			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeGoogleUser.email);
		});

		it('Should set status code 200 when user is a valid Google user', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeGoogleUser]);
			sandbox.stub(axios, 'get')
				.withArgs(`https://oauth2.googleapis.com/tokeninfo?id_token=${fakeGoogleUserRequest.googleIdToken}`)
				.resolves({ data: googleUserValidationResponse });
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/users/signIn')
				.send(fakeGoogleUserRequest);
			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body, { ...fakeGoogleUser, accessToken: 'fakeToken' });

			sandbox.assert.calledOnce(axios.get);
			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeGoogleUser.email);
			sandbox.assert.calledOnce(TokenServices.prototype.generateToken);
			sandbox.assert.calledOnce(Model.prototype.update);
		});
	});
});
