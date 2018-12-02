'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UnconnectedBugReporter = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _proptypes = require('proptypes');

var _proptypes2 = _interopRequireDefault(_proptypes);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isfunction');

var _lodash4 = _interopRequireDefault(_lodash3);

var _storeEnhancer = require('./store-enhancer');

var _utils = require('./utils');

var _default = require('./integrations/default');

var _default2 = _interopRequireDefault(_default);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('es6-promise').polyfill();

var loadingLayout = _react2.default.createElement(
	'div',
	{ className: 'Redux-Bug-Reporter' },
	_react2.default.createElement(
		'div',
		{ className: 'Redux-Bug-Reporter__loading-container' },
		_react2.default.createElement('span', { className: 'Redux-Bug-Reporter__loading' })
	)
);

var propTypes = {
	// passed in from parent
	submit: _proptypes2.default.oneOfType([_proptypes2.default.func, _proptypes2.default.string]).isRequired,
	projectName: _proptypes2.default.string.isRequired,
	redactStoreState: _proptypes2.default.func,
	name: _proptypes2.default.string,
	meta: _proptypes2.default.any, // eslint-disable-line react/forbid-prop-types
	customEncode: _proptypes2.default.func,
	customDecode: _proptypes2.default.func,
	// Passed in by redux-bug-reporter
	dispatch: _proptypes2.default.func.isRequired,
	storeState: _proptypes2.default.any.isRequired, // eslint-disable-line react/forbid-prop-types
	overloadStore: _proptypes2.default.func.isRequired,
	initializePlayback: _proptypes2.default.func.isRequired,
	finishPlayback: _proptypes2.default.func.isRequired
};

var defaultProps = {
	// passed in from parent
	redactStoreState: undefined,
	name: undefined,
	meta: undefined,
	customEncode: undefined,
	customDecode: undefined
};

var UnconnectedBugReporter = function (_React$Component) {
	_inherits(UnconnectedBugReporter, _React$Component);

	function UnconnectedBugReporter(props) {
		_classCallCheck(this, UnconnectedBugReporter);

		var _this = _possibleConstructorReturn(this, (UnconnectedBugReporter.__proto__ || Object.getPrototypeOf(UnconnectedBugReporter)).call(this));

		_this.state = {
			expanded: false,
			loading: false,
			bugFiled: false,
			reporter: props.name || '',
			description: '',
			screenshotURL: '',
			notes: '',
			error: '',
			bugURL: ''
		};

		_this.toggleExpanded = _this.toggleExpanded.bind(_this);
		_this.bugReporterPlayback = _this.bugReporterPlayback.bind(_this);
		_this.submit = _this.submit.bind(_this);
		_this.dismiss = _this.dismiss.bind(_this);
		_this.handleChange = _this.handleChange.bind(_this);
		return _this;
	}

	_createClass(UnconnectedBugReporter, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			(0, _utils.listenToErrors)();
			// Global function to play back a bug
			window.bugReporterPlayback = this.bugReporterPlayback;
		}
	}, {
		key: 'shouldComponentUpdate',
		value: function shouldComponentUpdate(nextProps, nextState) {
			// Do not bother rerendering every props change.
			// Rerender only needs to occur on state change
			if (this.state !== nextState) {
				return true;
			}
			return false;
		}
	}, {
		key: 'toggleExpanded',
		value: function toggleExpanded() {
			this.setState({ expanded: !this.state.expanded });
		}
	}, {
		key: 'bugReporterPlayback',
		value: function bugReporterPlayback(actions, initialState, finalState) {
			var _this2 = this;

			var delay = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;

			// eslint-disable-next-line no-shadow
			var _props = this.props,
			    dispatch = _props.dispatch,
			    overloadStore = _props.overloadStore,
			    customDecode = _props.customDecode;

			if (delay === -1) {
				// Do not playback, just jump to the final state
				overloadStore(finalState);
				return;
			}

			this.props.initializePlayback();
			if (customDecode) {
				/* eslint-disable no-param-reassign */
				initialState = customDecode(initialState);
				finalState = customDecode(finalState);
				/* eslint-enable no-param-reassign */
			}
			overloadStore(initialState);

			var performNextAction = function performNextAction() {
				var action = actions[0];

				// Let store know this is a playback action
				action[_storeEnhancer.playbackFlag] = true;

				dispatch(action);
				actions.splice(0, 1);
				if (actions.length > 0) {
					setTimeout(performNextAction, delay);
				} else {
					_this2.props.finishPlayback();
					var storeState = _this2.props.storeState;
					var keys = Object.keys(storeState);
					keys.forEach(function (key) {
						if (!(0, _lodash2.default)(storeState[key], finalState[key]) &&
						// In case reducer is an immutableJS object, call toJSON on it.
						!(storeState[key].toJSON && finalState[key].toJSON && (0, _lodash2.default)(storeState[key].toJSON(), finalState[key].toJSON()))) {
							console.log('The following reducer does not strictly equal the bug report final state: ' + key + '. I\'ll print them both out so you can see the differences.');
							console.log(key + ' current state:', storeState[key], '\n' + key + ' bug report state:', finalState[key]);
						}
					});
					console.log('Playback complete!');
				}
			};

			performNextAction();
		}
	}, {
		key: 'submit',
		value: function submit(e) {
			var _this3 = this;

			e.preventDefault();
			var _props2 = this.props,
			    submit = _props2.submit,
			    projectName = _props2.projectName,
			    storeState = _props2.storeState,
			    redactStoreState = _props2.redactStoreState,
			    meta = _props2.meta,
			    customEncode = _props2.customEncode;
			var _state = this.state,
			    reporter = _state.reporter,
			    description = _state.description,
			    screenshotURL = _state.screenshotURL,
			    notes = _state.notes;

			this.setState({ loading: true });

			var state = storeState;
			var initialState = _storeEnhancer.enhancerLog.getBugReporterInitialState();
			var promise = void 0;
			if (redactStoreState) {
				initialState = redactStoreState(initialState);
				state = redactStoreState(state);
			}

			if (customEncode) {
				initialState = customEncode(initialState);
				state = customEncode(state);
			}

			var newBug = {
				projectName: projectName,
				state: state,
				initialState: initialState,
				actions: _storeEnhancer.enhancerLog.getActions(),
				consoleErrors: _utils.errorData.getErrors(),
				reporter: reporter,
				description: description,
				screenshotURL: screenshotURL,
				notes: notes,
				meta: meta,
				useragent: window.navigator.userAgent,
				windowDimensions: [window.innerWidth, window.innerHeight],
				windowLocation: window.location.href

				// if submit is a function, call it instead of fetching
				// and attach to the promise returned
			};if ((0, _lodash4.default)(submit)) {
				promise = submit(newBug);
			} else {
				var submitFn = (0, _default2.default)({ url: submit });
				promise = submitFn(newBug);
			}

			promise.then(function () {
				var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
				var bugURL = json.bugURL;

				_this3.setState({
					loading: false,
					bugFiled: true,
					bugURL: bugURL,
					expanded: true
				});
			}).catch(function (error) {
				console.error('Error filing bug', error);
				_this3.setState({
					loading: false,
					bugFiled: true,
					error: error,
					expanded: true
				});
			});
		}
	}, {
		key: 'dismiss',
		value: function dismiss(e) {
			e.preventDefault();
			this.setState({ bugFiled: false, expanded: false, bugURL: '' });
		}
	}, {
		key: 'handleChange',
		value: function handleChange(field) {
			var _this4 = this;

			return function (e) {
				_this4.setState(_defineProperty({}, field, e.target.value));
			};
		}
	}, {
		key: 'render',
		value: function render() {
			var _state2 = this.state,
			    reporter = _state2.reporter,
			    description = _state2.description,
			    screenshotURL = _state2.screenshotURL,
			    notes = _state2.notes,
			    loading = _state2.loading,
			    bugFiled = _state2.bugFiled,
			    error = _state2.error,
			    expanded = _state2.expanded,
			    bugURL = _state2.bugURL;

			if (loading) {
				return loadingLayout;
			}

			if (bugFiled) {
				return _react2.default.createElement(
					'div',
					{ className: 'Redux-Bug-Reporter' },
					_react2.default.createElement(
						'div',
						{
							className: 'Redux-Bug-Reporter__form Redux-Bug-Reporter__form--' + (error ? 'fail' : 'success')
						},
						error ? _react2.default.createElement(
							'div',
							null,
							_react2.default.createElement(
								'div',
								null,
								'Oops, something went wrong!'
							),
							_react2.default.createElement(
								'div',
								null,
								'Please try again later'
							)
						) : _react2.default.createElement(
							'div',
							null,
							_react2.default.createElement(
								'div',
								null,
								'Your bug has been filed successfully!'
							),
							bugURL && _react2.default.createElement(
								'div',
								null,
								_react2.default.createElement(
									'a',
									{ target: '_blank', rel: 'noopener noreferrer', href: bugURL },
									'Here is a link to it!'
								)
							)
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'Redux-Bug-Reporter__show-hide-container' },
						_react2.default.createElement('button', {
							className: 'Redux-Bug-Reporter__show-hide-button Redux-Bug-Reporter__show-hide-button--' + (error ? 'expanded' : 'collapsed'),
							onClick: this.dismiss
						})
					)
				);
			}

			return _react2.default.createElement(
				'div',
				{ className: 'Redux-Bug-Reporter' },
				expanded && _react2.default.createElement(
					'div',
					{ className: 'Redux-Bug-Reporter__form' },
					_react2.default.createElement(
						'form',
						{ onSubmit: this.submit },
						_react2.default.createElement('input', {
							className: 'Redux-Bug-Reporter__form-input Redux-Bug-Reporter__form-input--reporter',
							onChange: this.handleChange('reporter'),
							value: reporter,
							placeholder: 'Name'
						}),
						_react2.default.createElement('input', {
							className: 'Redux-Bug-Reporter__form-input Redux-Bug-Reporter__form-input--description',
							onChange: this.handleChange('description'),
							value: description,
							placeholder: 'Description'
						}),
						_react2.default.createElement('input', {
							className: 'Redux-Bug-Reporter__form-input Redux-Bug-Reporter__form-input--screenshotURL',
							onChange: this.handleChange('screenshotURL'),
							value: screenshotURL,
							placeholder: 'Screenshot URL'
						}),
						_react2.default.createElement('textarea', {
							className: 'Redux-Bug-Reporter__form-input Redux-Bug-Reporter__form-input--notes',
							onChange: this.handleChange('notes'),
							value: notes,
							placeholder: 'Notes'
						}),
						_react2.default.createElement(
							'button',
							{
								className: 'Redux-Bug-Reporter__submit-button',
								type: 'submit'
							},
							'File Bug'
						)
					)
				),
				_react2.default.createElement(
					'div',
					{ className: 'Redux-Bug-Reporter__show-hide-container' },
					_react2.default.createElement('button', {
						className: 'Redux-Bug-Reporter__show-hide-button Redux-Bug-Reporter__show-hide-button--' + (this.state.expanded ? 'expanded' : 'collapsed'),
						onClick: this.toggleExpanded
					})
				)
			);
		}
	}]);

	return UnconnectedBugReporter;
}(_react2.default.Component);

UnconnectedBugReporter.displayName = 'Bug Reporter';
UnconnectedBugReporter.propTypes = propTypes;
UnconnectedBugReporter.defaultProps = defaultProps;

var mapStateToProps = function mapStateToProps(store) {
	return {
		storeState: store
	};
};

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	var boundActions = (0, _redux.bindActionCreators)({ overloadStore: _storeEnhancer.overloadStore, initializePlayback: _storeEnhancer.initializePlayback, finishPlayback: _storeEnhancer.finishPlayback }, dispatch);
	return _extends({
		dispatch: dispatch
	}, boundActions);
};

var ConnectedBugReporter = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(UnconnectedBugReporter);

exports.UnconnectedBugReporter = UnconnectedBugReporter;
exports.default = ConnectedBugReporter;