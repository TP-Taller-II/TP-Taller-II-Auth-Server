'use strict';

const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const mustache = require('mustache');
const emailHelper = require('../helpers/email-helper');
const options = require('./config');

module.exports = class Mailer {

	constructor() {
		this.client = nodemailer.createTransport(sgTransport(options));
	}

	sendEmail(email) {

		// no estoy muy segura de que se resuelva correctamente esta promise
		this.client.sendMail(email, err => {
			if (err)
				console.log(err);
			else
				console.log(`Mensaje enviado a: ${email.to}`);
		});
	}

	sendInvitationEmail(shareRequestId, guestEmail, hostEmail, fileName) {

		const emailBody = mustache.render(emailHelper(shareRequestId, hostEmail, fileName));

		const email = {
			from: 'tp.tdd.drive@gmail.com',
			to: guestEmail,
			subject: 'Invitacion para acceso',
			html: emailBody,
		};

		this.sendEmail(email);
	}
};
