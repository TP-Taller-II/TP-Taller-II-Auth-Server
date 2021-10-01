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
		canShare: [],
		canRead: [],
		name: 'Ariel',
		surname: 'Piro Martino',
		birthDate: '1996-08-03T00:00:00.000Z',
		email: 'ariel.piro@hotmail.com',
		password: '$2b$10$FVLh9oI6betv13edzE9cQuNbXVFqTu3pp3MfKP9mp9Uv/rVXQuDf6',
		provider: 'email',
		profilePic: 'https://firebasestorage.googleapis.com/v0/b/tddrive-b11e3.appspot.com/o/8a909882b3c6a2fcba6e1d4a42dabd42.jpg',
		createdAt: '2021-03-08T00:24:27.083Z',
		updatedAt: '2021-03-09T21:43:10.726Z',
		__v: 0,
	};

	describe('Patch', async () => {

		it('Should return 500 when the password is not provided', async () => {

			const { password, ...formattedBody } = fakeUser;

			const res = await chai.request(app).patch('/api/users/me')
				.send(formattedBody)
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
		});

		it('Should set status code 500 when it verify the password', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(false);

			const res = await chai.request(app).patch('/api/users/me')
				.send(fakeUser)
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);

			sandbox.assert.calledOnce(Model.prototype.findBy);
			sandbox.assert.calledOnce(Bcrypt.compare);
		});

		it('Should set status code 200 when it can update the user', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([fakeUser]);
			sandbox.stub(Bcrypt, 'compare').resolves(true);
			sandbox.stub(TokenServices.prototype, 'generateToken').returns('fakeToken');
			sandbox.stub(Model.prototype, 'update').returns(true);

			const res = await chai.request(app).patch('/api/users/me')
				.send(fakeUser)
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.OK);

			sandbox.assert.calledTwice(Model.prototype.findBy);
			sandbox.assert.calledOnce(Bcrypt.compare);
			sandbox.assert.calledOnce(TokenServices.prototype.generateToken);
			sandbox.assert.calledTwice(Model.prototype.update);
		});

		it('Should set status code 500 when database fails', async () => {

			sandbox.stub(Model.prototype, 'findBy').rejects(new Error('DB ERROR'));

			const res = await chai.request(app).patch('/api/users/me')
				.send(fakeUser)
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnce(Model.prototype.findBy);
		});
	});
});
