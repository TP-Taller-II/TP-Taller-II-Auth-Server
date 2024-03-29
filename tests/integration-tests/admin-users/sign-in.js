'use strict';

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

describe('AdminUsers', async () => {

	beforeEach(() => {
		process.env.PORT = 3030;
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});

	const fakeAdminUser = {
		_id: '60456ebb0190bf001f6bbee2',
		email: 'some.email@hotmail.com',
		password: '$2b$10$FVLh9oI6betv13edzE9cQuNbXVFqTu3pp3MfKP9mp9Uv/rVXQuDf6',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};

	describe('Sign in', async () => {

		it('Should set status code 400 when user is not found', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app).post('/auth-server/v1/admin/signIn')
				.send(fakeAdminUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid email' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeAdminUser.email);
		});

		it('Should set status code 200 when user is valid', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeAdminUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(false);
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/admin/signIn')
				.send(fakeAdminUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
			assert.deepStrictEqual(res.body, { message: 'Invalid email or password' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeAdminUser.email);
			sandbox.assert.calledOnce(Bcrypt.compare);
			sandbox.assert.notCalled(TokenServices.prototype.generateToken);
			sandbox.assert.notCalled(Model.prototype.update);
		});

		it('Should set status code 200 when user is valid', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeAdminUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(true);
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/admin/signIn')
				.send(fakeAdminUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			const { password, ...formattedUser } = fakeAdminUser;
			assert.deepStrictEqual(res.body, { ...formattedUser, accessToken: 'fakeToken' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeAdminUser.email);
			sandbox.assert.calledOnce(Bcrypt.compare);
			sandbox.assert.calledOnce(TokenServices.prototype.generateToken);
			sandbox.assert.calledOnce(Model.prototype.update);
		});

		it('Should set status code 500 when database fails', async () => {

			sandbox.stub(Model.prototype, 'findBy').rejects(new Error('DB ERROR'));

			const res = await chai.request(app).post('/auth-server/v1/admin/signIn')
				.send(fakeAdminUser);
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});
	});

	it('Should set status code 400 when the passwords don\'t match', async () => {

		sandbox.stub(Model.prototype, 'findBy').resolves([fakeAdminUser]);
		sandbox.stub(Bcrypt, 'compare').resolves(false);
		sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
		sandbox.stub(Model.prototype, 'update').resolves(true);

		const res = await chai.request(app).post('/auth-server/v1/admin/signIn')
			.send({ ...fakeAdminUser, password: 'notcorrect' });
		assert.deepStrictEqual(res.status, STATUS_CODES.BAD_REQUEST);
		assert.deepStrictEqual(res.body, { message: 'Invalid email or password' });

		sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', fakeAdminUser.email);
		sandbox.assert.calledOnce(Bcrypt.compare);
		sandbox.assert.notCalled(TokenServices.prototype.generateToken);
		sandbox.assert.notCalled(Model.prototype.update);
	});
});
