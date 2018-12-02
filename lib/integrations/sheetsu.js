'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/* global fetch */
require('isomorphic-fetch');

var createSubmit = function createSubmit(_ref) {
	var url = _ref.url;
	return function (newBug) {
		try {
			/* eslint-disable no-param-reassign */
			newBug.actions = JSON.stringify(newBug.actions);
			newBug.state = JSON.stringify(newBug.state);
			newBug.initialState = JSON.stringify(newBug.initialState);
			newBug.meta = JSON.stringify(newBug.meta);
			/* eslint-enable no-param-reassign */
		} catch (e) {
			return new Promise(function (resolve, reject) {
				reject(e);
			});
		}
		var playback = 'window.bugReporterPlayback(' + newBug.actions + ',' + newBug.initialState + ',' + newBug.state + ',100)';
		return fetch(url, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(_extends({}, newBug, {
				playback: playback
			}))
		}).then(function (response) {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json();
		});
	};
};
exports.default = createSubmit;