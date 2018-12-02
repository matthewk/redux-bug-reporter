'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global fetch */
require('isomorphic-fetch');

var createSubmit = function createSubmit(_ref) {
	var url = _ref.url,
	    fetchProps = _ref.fetchProps;
	return function (newBug) {
		return fetch(url, _extends({
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newBug)
		}, fetchProps)).then(function (response) {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json();
		});
	};
};
exports.default = createSubmit;