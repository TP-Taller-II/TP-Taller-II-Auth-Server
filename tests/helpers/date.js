'use strict';

const assert = require('assert');
const { addDaysToDate, addHoursToDate } = require('../../src/helpers/date');


describe('Utils', () => {

	describe('addHoursToDate', () => {

		it('Should add hours to date', () => {

			const someDate = new Date();
			someDate.setHours(0);
			const someDateIn6Hours = addHoursToDate(6, someDate);
			assert.deepStrictEqual(
				[someDate.getDay(), someDate.getMonth(), someDate.getFullYear(), someDate.getHours() + 6],
				[someDateIn6Hours.getDay(), someDateIn6Hours.getMonth(), someDateIn6Hours.getFullYear(), someDateIn6Hours.getHours()]);
		});

		it('Should throw an error when hours is not a number', () => {

			const someDate = new Date();
			assert.throws(() => addHoursToDate(['not-number'], someDate));
		});

		it('Should throw an error when hours is not a number greater than zero', () => {

			const someDate = new Date();
			assert.throws(() => addHoursToDate(-100, someDate));
		});

		it('Should throw an error when date is not a date', () => {
			assert.throws(() => addHoursToDate(20, 'not a date'));
		});
	});

	describe('addDaysToDate', () => {

		it('Should add hours to date', () => {

			const someDate = new Date();
			someDate.setDate(1);
			const someDateIn6Days = addDaysToDate(6, someDate);
			assert.deepStrictEqual(
				[someDate.getDate() + 6, someDate.getMonth(), someDate.getFullYear()],
				[someDateIn6Days.getDate(), someDateIn6Days.getMonth(), someDateIn6Days.getFullYear()]);
		});

		it('Should throw an error when days is not a number', () => {

			const someDate = new Date();
			assert.throws(() => addDaysToDate(['not-number'], someDate));
		});

		it('Should throw an error when days is not a number greater than zero', () => {

			const someDate = new Date();
			assert.throws(() => addDaysToDate(-100, someDate));
		});

		it('Should throw an error when date is not a date', () => {
			assert.throws(() => addDaysToDate(20, 'not a date'));
		});
	});
});
