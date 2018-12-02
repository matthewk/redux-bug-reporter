'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* global fetch */


require('isomorphic-fetch');

var createSubmit = function createSubmit(config) {
	var access_token = config.access_token,
	    rest = _objectWithoutProperties(config, ['access_token']);

	return function (newBug) {
		/* eslint-disable prefer-const */
		var useragent = newBug.useragent,
		    notes = newBug.notes,
		    description = newBug.description,
		    screenshotURL = newBug.screenshotURL,
		    reporter = newBug.reporter,
		    actions = newBug.actions,
		    initialState = newBug.initialState,
		    state = newBug.state,
		    consoleErrors = newBug.consoleErrors,
		    meta = newBug.meta,
		    windowDimensions = newBug.windowDimensions,
		    windowLocation = newBug.windowLocation;
		/* eslint-enable prefer-const */

		try {
			actions = JSON.stringify(actions);
			state = JSON.stringify(state);
			initialState = JSON.stringify(initialState);
			meta = JSON.stringify(meta);
		} catch (e) {
			return new Promise(function (resolve, reject) {
				reject(e);
			});
		}
		var _parser$browser = (0, _uaParserJs2.default)(useragent).browser,
		    uaName = _parser$browser.name,
		    uaVersion = _parser$browser.version;

		var title = '' + description;
		var body = 'Notes\n' + notes + '\n\nMeta information\nBug filed by: ' + reporter + '\nScreenshot URL (if added): ' + screenshotURL + '\nConsole Errors: ' + consoleErrors + '\nURL: ' + windowLocation + '\nWindow Dimensions: ' + windowDimensions + '\nMeta information: ' + meta + '\nUser Agent: ' + uaName + ' version ' + uaVersion + '\n\nPlayback script:\nwindow.bugReporterPlayback(' + actions + ',' + initialState + ',' + state + ',100)\n\nBug submitted through https://github.com/dtschust/redux-bug-reporter\n';
		return fetch('https://app.asana.com/api/1.0/tasks', {
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: 'Bearer ' + access_token, // eslint-disable-line camelcase
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				data: _extends({
					notes: body,
					name: title
				}, rest)
			})
		}).then(function (response) {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response.json();
		});
	};
};
exports.default = createSubmit;