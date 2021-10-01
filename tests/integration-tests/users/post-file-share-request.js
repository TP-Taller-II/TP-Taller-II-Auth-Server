'use strict';

const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const sandbox = require('sinon').createSandbox();

const { TokenServices } = require('../../../src/services');
const Model = require('../../../src/databases/mongodb/model');
const Mailer = require('../../../src/mailer');
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

	const shareRequest = {
		_id: '60465d7ff28dcf001ff6dd70',
		accepted: false,
		hostEmail: 'apiro@fi.uba.ar',
		guestEmail: 'ariel.piro@hotmail.com',
		fileId: '60465d25f28dcf001ff6dd6f',
		fileName: 'sarasa',
		canShare: true,
	};

	const guest = {
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

	describe('accept share request', async () => {

		it('Should set status code 200 when it can accept the share request (can read mode)', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([]);

			const res = await chai.request(app).post('/api/users/fileShareRequest')
				.send(shareRequest)
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.NOT_FOUND);

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', guest.email);
		});


		it('Should set status code 200 when it can accept the share request (can read mode)', async () => {

			sandbox.stub(Model.prototype, 'findBy').resolves([guest]);
			sandbox.stub(Model.prototype, 'create').resolves(shareRequest);
			sandbox.stub(Mailer.prototype, 'sendInvitationEmail').resolves(true);

			const res = await chai.request(app).post('/api/users/fileShareRequest')
				.send(shareRequest)
				.set('x-auth-token', 'some-valid-token');
			assert.deepStrictEqual(res.status, STATUS_CODES.OK);
			assert.deepStrictEqual(res.body, { message: 'The file share invitation was sent' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', guest.email);
			sandbox.assert.calledOnceWithExactly(Model.prototype.create, shareRequest);
			sandbox.assert.calledOnceWithExactly(Mailer.prototype.sendInvitationEmail,
				shareRequest._id, shareRequest.guestEmail, shareRequest.hostEmail, shareRequest.fileName);
		});

		it('Should set status code 500 when database fails', async () => {

			sandbox.stub(Model.prototype, 'findBy').rejects(new Error('DB ERROR'));
			sandbox.stub(Model.prototype, 'create').resolves(true);

			const res = await chai.request(app).post('/api/users/fileShareRequest')
				.send(shareRequest)
				.set('x-auth-token', 'some-valid-token');

			assert.deepStrictEqual(res.status, STATUS_CODES.INTERNAL_SERVER_ERROR);
			assert.deepStrictEqual(res.body, { message: 'DB ERROR' });

			sandbox.assert.calledOnceWithExactly(Model.prototype.findBy, 'email', guest.email);
			sandbox.assert.notCalled(Model.prototype.create);
		});
	});
});
