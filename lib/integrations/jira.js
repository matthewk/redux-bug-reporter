'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* global fetch */
require('isomorphic-fetch');

var createSubmit = function createSubmit(_ref) {
	var url = _ref.url;
	return function (newBug) {
		return fetch(url, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newBug)
		}).then(function (response) {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json();
		});
	};
};
exports.default = createSubmit;