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

describe('Users', async () => {

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

			sandbox.stub(Model.prototype, 'update').resolves(true);

			const res = await chai.request(app).post('/auth-server/v1/users/signOut')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body, { message: 'User sign out' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.update, { _id: '60456ebb0190bf001f6bbee2' }, { accessToken: null });
		});

		it('Should set status code 500 when database fails', async () => {

			sandbox.stub(Model.prototype, 'update').rejects(new Error('DB ERROR'));

			const res = await chai.request(app).post('/auth-server/v1/users/signOut')
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.update);
		});
	});
});
