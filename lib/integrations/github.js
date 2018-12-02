'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _uaParserJs = require('ua-parser-js');

var _uaParserJs2 = _interopRequireDefault(_uaParserJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('isomorphic-fetch'); /* global fetch */


var createSubmit = function createSubmit(_ref) {
	var github_owner = _ref.github_owner,
	    github_repo = _ref.github_repo,
	    access_token = _ref.access_token;
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
		var body = '## Notes\n' + notes + '\n## Meta information\n*Bug filed by*: ' + reporter + '\n*Screenshot URL (if added)*: ' + screenshotURL + '\n*Console Errors*: `' + consoleErrors + '`\n*URL*: ' + windowLocation + '\n*Window Dimensions*: ' + windowDimensions + '\n*Meta information*: ' + meta + '\n*User Agent*: ' + uaName + ' version ' + uaVersion + '\nPlayback script:\n```js\nwindow.bugReporterPlayback(' + actions + ',' + initialState + ',' + state + ',100)\n```\n*Bug submitted through [redux-bug-reporter](https://github.com/dtschust/redux-bug-reporter)*\n';
		/* eslint-disable camelcase */
		return fetch('https://api.github.com/repos/' + github_owner + '/' + github_repo + '/issues?access_token=' + access_token, {
			// eslint-disable-line camelcase
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: title,
				body: body
			})
		});
		/* eslint-enable camelcase */
	};
};

exports.default = createSubmit;