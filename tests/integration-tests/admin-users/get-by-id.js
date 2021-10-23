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

	const fakeUser = {
		_id: '60456ebb0190bf001f6bbee2',
		name: 'Userfirstname',
		surname: 'Userlastname',
		birthDate: '1996-08-03T00:00:00.000Z',
		email: 'some.email@hotmail.com',
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

	describe('Get by Id', async () => {

		it('Should set status code 401 when no token is provided', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeAdminUser]);

			const res = await chai.request(app).get(`/auth-server/v1/admin/users/${fakeUser._id}`);

			assert.deepStrictEqual(res.status, STATUS_CODES.UNAUTHORIZED);

			sandbox.assert.notCalled(Model.prototype.findBy);
		});

		it('Should set status code 200 when user is valid', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser])
				.withArgs('_id', fakeUser._id)
				.resolves([fakeUser]);

			const res = await chai.request(app).get(`/auth-server/v1/admin/users/${fakeUser._id}`)
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			const { password, token, ...formattedUser } = fakeUser;
			assert.deepStrictEqual(res.body, formattedUser);

			sandbox.assert.calledTwice(Model.prototype.findBy);
		});

		it('Should set status code 500 when database fails when trying to find the user', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser])
				.withArgs('_id', fakeUser._id)
				.rejects(new Error('DB ERROR'));

			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');

			const res = await chai.request(app).get(`/auth-server/v1/admin/users/${fakeUser._id}`)
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledTwice(Model.prototype.findBy);
		});

		it('Should set status code 500 when database fails when trying to find the admin user', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.rejects(new Error('DB ERROR'));

			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');

			const res = await chai.request(app).get(`/auth-server/v1/admin/users/${fakeUser._id}`)
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});

		it('Should set status code 403 when admin user is not found', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([]);

			const res = await chai.request(app).get(`/auth-server/v1/admin/users/${fakeUser._id}`)
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.FORBIDDEN);
			assert.deepStrictEqual(res.body, { message: 'Access denied. Not an admin user.' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});
	});
});
