"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.listenToErrors = listenToErrors;
var errorData = exports.errorData = {
	errors: [],
	addError: function addError(error) {
		this.errors.push(error);
	},
	clearErrors: function clearErrors() {
		this.errors = [];
	},
	getErrors: function getErrors() {
		return this.errors;
	}
};

function listenToConsoleError() {
	var origError = window.console.error;
	if (!origError.bugReporterOverrideComplete) {
		window.console.error = function error() {
			var metadata = void 0;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (args && args[0] && args[0].stack) {
				metadata = {
					errorMsg: args[0].name + ": " + args[0].message,
					stackTrace: args[0].stack
				};
			} else {
				metadata = {
					errorMsg: args && args[0]
				};
			}
			errorData.addError(metadata);
			origError.apply(this, args);
		};
		window.console.error.bugReporterOverrideComplete = true;
	}
}

function listenToOnError() {
	var origWindowError = window.onerror;
	if (!origWindowError || !origWindowError.bugReporterOverrideComplete) {
		window.onerror = function onerror(errorMsg, url, lineNumber, columnNumber, errorObj) {
			var metadata = {
				errorMsg: errorMsg,
				stackTrace: errorObj && errorObj.stack
			};
			errorData.addError(metadata);
			if (origWindowError) {
				// eslint-disable-next-line prefer-rest-params
				origWindowError.apply(window, arguments);
			}
		};
		window.onerror.bugReporterOverrideComplete = true;
	}
}

function listenToErrors() {
	listenToConsoleError();
	listenToOnError();
}