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
		_id: '60456ebb0190bf001f6bbee2',
		email: 'admin@hotmail.com',
		password: '$2b$10$FVLh9oI6betv13edzE9cQuNbXVFqTu3pp3MfKP9mp9Uv/rVXQuDf6',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};

	beforeEach(() => {
		process.env.PORT = 3030;
		sandbox.stub(TokenServices.prototype, 'verifyToken').resolves({ _id: '60456ebb0190bf001f6bbee2' });
	});

	afterEach(() => {
		delete process.env.PORT;
		sandbox.restore();
	});


	describe('Sign out', async () => {

		it('Should set status code 200 when it removes the token', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser]);

			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/admin/signOut')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body, { message: 'User sign out' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.calledOnceWithExactly(Model.prototype.update, { _id: '60456ebb0190bf001f6bbee2' }, { accessToken: null });
		});

		it('Should set status code 500 when database fails when updating admin user', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([fakeAdminUser]);
			sandbox.stub(Model.prototype, 'update').rejects(new Error('DB ERROR'));

			const res = await chai.request(app).post('/auth-server/v1/admin/signOut')
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.calledOnce(Model.prototype.update);
		});

		it('Should set status code 500 when database fails when finding admin user', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.rejects(new Error('DB ERROR'));
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/admin/signOut')
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.notCalled(Model.prototype.update);
		});

		it('Should set status code 500 when admin user is not found', async () => {

			sandbox.stub(Model.prototype, 'findBy')
				.withArgs('_id', fakeAdminUser._id)
				.resolves([]);
			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/admin/signOut')
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.FORBIDDEN);
			assert.deepStrictEqual(res.body, { message: 'Access denied. Not an admin user.' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.notCalled(Model.prototype.update);
		});
	});
});
