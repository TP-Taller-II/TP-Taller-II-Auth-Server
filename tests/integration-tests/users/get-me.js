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

	const fakeUser = {
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

	describe('Get me', async () => {

		it('Should set status code 200 when user is valid', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeUser]);

			const res = await chai.request(app).get('/auth-server/v1/users/me')
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			const { password, token, ...formattedUser } = fakeUser;
			assert.deepStrictEqual(res.body, formattedUser);

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, '_id', fakeUser._id);
		});

		it('Should set status code 500 when database fails', async () => {

			sandbox.stub(Model.prototype, 'findBy').rejects(new Error('DB ERROR'));
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');

			const res = await chai.request(app).get('/auth-server/v1/users/me')
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});
	});
});
