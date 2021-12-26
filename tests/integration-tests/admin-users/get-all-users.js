'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const { TokenServices } = require('../../../src/services');
const Model = require('../../../src/databases/mongodb/model');
const STATUS_CODES = require('../../../src/utils/status-codes.json');

process.env.PORT = 3030;

const app = require('../../../src');

chai.use(chaiHttp);

describe('AdminUsers', async () => {

	const fakeAdminUser = {
		_id: '60456ebb0190bf001f6bbee1',
		email: 'admin@hotmail.com',
		password: '$2b$10$FVLh9oI6betv13edzE9cQuNbXVFqTu3pp3MfKP9mp9Uv/rVXQuDf6',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};

	const fakeUser1 = {
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

	const fakeUser2 = {
		_id: '60456ebb0190bf001f6bbee3',
		name: 'Userfirstname3',
		surname: 'Userlastname3',
		email: 'some.other.email@hotmail.com',
		password: '$2b$10$FVLh9oI6betv13edzE9cQuNbXVFqTu3pp3MfKP9mp9Uv/rVXQuDf6',
		provider: 'email',
		profilePic: 'https://firebasestorage.googleapis.com/v0/b/tddrive-b11e3.appspot.com/o/8a909882b3c6a2fcba6e1d4a42dabd42.jpg',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};


	beforeEach(() => {
		process.env.PORT = 3030;
		sandbox.stub(TokenServices.prototype, 'verifyToken').resolves({ _id: fakeAdminUser._id });
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	describe('Get All Users', async () => {

		it('Should set status code 401 when no token is provided', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeAdminUser]);

			const res = await chai.request(app).get('/auth-server/v1/admin/users');

			assert.deepStrictEqual(res.status, STATUS_CODES.UNAUTHORIZED);

			sandbox.assert.notCalled(Model.prototype.findBy);
		});

		it('Should set status code 200 and get all users', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser]);
			sandbox.stub(Model.prototype, 'find')
				.resolves([fakeUser1, fakeUser2]);

			const res = await chai.request(app).get('/auth-server/v1/admin/users')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			const usersExpected = [
				{
					_id: fakeUser1._id, email: fakeUser1.email, name: fakeUser1.name, surname: fakeUser1.surname, profilePic: fakeUser1.profilePic,
				},
				{
					_id: fakeUser2._id, email: fakeUser2.email, name: fakeUser2.name, surname: fakeUser2.surname, profilePic: fakeUser2.profilePic,
				},
			];
			assert.deepStrictEqual(res.body, usersExpected);

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.calledOnce(Model.prototype.find);
		});

		it('Should set status code 200 and get all users (but there aren\'t any)', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser]);
			sandbox.stub(Model.prototype, 'find')
				.resolves([]);

			const res = await chai.request(app).get('/auth-server/v1/admin/users')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			const usersExpected = [];
			assert.deepStrictEqual(res.body, usersExpected);

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.calledOnce(Model.prototype.find);
		});

		it('Should set status code 500 when database fails when trying to find all users', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser]);
			sandbox.stub(Model.prototype, 'find')
				.rejects(new Error('DB ERROR'));

			const res = await chai.request(app).get('/auth-server/v1/admin/users')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.calledOnce(Model.prototype.find);
		});

		it('Should set status code 500 when database fails when trying to find the admin user', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.rejects(new Error('DB ERROR'));
			sandbox.stub(Model.prototype, 'find')
				.resolves([]);

			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');

			const res = await chai.request(app).get('/auth-server/v1/admin/users')
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.notCalled(Model.prototype.find);
		});

		it('Should set status code 403 when admin user is not found', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([]);
			sandbox.stub(Model.prototype, 'find')
				.resolves([]);

			const res = await chai.request(app).get('/auth-server/v1/admin/users')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.FORBIDDEN);
			assert.deepStrictEqual(res.body, { message: 'Access denied. Not an admin user.' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.notCalled(Model.prototype.find);
		});
	});
});
