'use strict';

const validateParams = (quantity, date) => {

	if (!Number.isInteger(quantity) || quantity <= 0)
		throw new Error('The quantity to add should be a number greater or equal than zero');

	if (!(date instanceof Date))
		throw new Error('Date should be instance of Date');
};

const addHoursToDate = (hours, date) => {

	validateParams(hours, date);

	const newDate = new Date(date);
	newDate.setHours(date.getHours() + hours);
	return newDate;
};

const addDaysToDate = (days, date) => {

	validateParams(days, date);

	const newDate = new Date(date);
	newDate.setDate(newDate.getDate() + days);
	return newDate;
};

module.exports = {
	addHoursToDate,
	addDaysToDate,
};
