'use strict';

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODEL = undefined;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MODEL = exports.MODEL = (0, _symbol2.default)('MODEL');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnN0YW50cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQU8sTUFBTSx3QkFBUSxzQkFBTyxPQUFQLENBQVIiLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IE1PREVMID0gU3ltYm9sKCdNT0RFTCcpO1xuIl19
'use strict';

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidCredentialsError = exports.InvalidResponseTypeError = exports.InvalidGrantTypeError = exports.InvalidInputError = exports.MissingInputError = exports.GenericError = exports.OAUTH2_ERROR = undefined;
exports.toOAuthError = toOAuthError;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const OAUTH2_ERROR = exports.OAUTH2_ERROR = (0, _symbol2.default)('OAuth2 Error');

class GenericError extends Error {
  constructor() {
    var _temp;

    return _temp = super(...arguments), this.name = 'invalid_request', this.statusCode = 400, this.type = OAUTH2_ERROR, _temp;
  }

  toJSON(_ref) {
    let state = _ref.state;

    return {
      error: this.name,
      error_description: this.message,
      state
    };
  }
}

exports.GenericError = GenericError;
class MissingInputError extends GenericError {
  constructor(input) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    super(...args);
    this.input = input;
    this.message = `The required parameter ${ this.input } is missing.`;
  }
}

exports.MissingInputError = MissingInputError;
class InvalidInputError extends GenericError {
  constructor(param, actual, expected) {
    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    super(...args);
    this.name = 'Invalid Input';
    if (!actual || !expected) {
      this.message = `Invalid input for "${ param }"`;
    } else {
      this.message = `The value "${ actual }" for parameter "${ param }" is \
invalid and must be ${ typeof expected === 'string' ? `"${ expected }"` : `one of ${ expected.map(s => `"${ s }"`).join(', ') }` }`;
    }
  }
}

exports.InvalidInputError = InvalidInputError;
class InvalidGrantTypeError extends InvalidInputError {
  constructor(actual, expected) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    super('grant_type', actual, expected, ...args);
  }
}
exports.InvalidGrantTypeError = InvalidGrantTypeError;
class InvalidResponseTypeError extends InvalidInputError {
  constructor(actual, expected) {
    for (var _len4 = arguments.length, args = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
      args[_key4 - 2] = arguments[_key4];
    }

    super('response_type', actual, expected, ...args);
  }
}

exports.InvalidResponseTypeError = InvalidResponseTypeError;
class InvalidCredentialsError extends InvalidInputError {
  constructor() {
    var _temp2;

    return _temp2 = super(...arguments), this.name = 'Invalid Credentials', this.message = 'Invalid values for "password" or "username"', _temp2;
  }

}

exports.InvalidCredentialsError = InvalidCredentialsError;
function toOAuthError(error, state) {
  if (error.type === Object(OAUTH2_ERROR)) {
    return error.toJSON();
  }
  return new GenericError(error.message).toJSON({ state });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVycm9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBd0RnQjs7OztBQXhEVCxNQUFNLHNDQUFlLHNCQUFPLGNBQVAsQ0FBZjs7QUFFTixNQUFNLFlBQU4sU0FBMkIsS0FBM0IsQ0FBaUM7Ozs7NkNBQ3RDLE9BQU8sd0JBQ1AsYUFBYSxVQUNiLE9BQU87R0FIK0I7O0FBSXRDLGVBQWtCO1FBQVQsbUJBQVM7O0FBQ2hCLFdBQU87QUFDTCxhQUFPLEtBQUssSUFBTDtBQUNQLHlCQUFtQixLQUFLLE9BQUw7QUFDbkIsV0FISztLQUFQLENBRGdCO0dBQWxCO0NBSks7O1FBQU07QUFhTixNQUFNLGlCQUFOLFNBQWdDLFlBQWhDLENBQTZDO0FBQ2xELGNBQVksS0FBWixFQUE0QjtzQ0FBTjs7S0FBTTs7QUFDMUIsVUFBTSxHQUFHLElBQUgsQ0FBTixDQUQwQjtBQUUxQixTQUFLLEtBQUwsR0FBYSxLQUFiLENBRjBCO0FBRzFCLFNBQUssT0FBTCxHQUFlLENBQUMsdUJBQUQsR0FBMEIsS0FBSyxLQUFMLEVBQVcsWUFBckMsQ0FBZixDQUgwQjtHQUE1QjtDQURLOztRQUFNO0FBUU4sTUFBTSxpQkFBTixTQUFnQyxZQUFoQyxDQUE2QztBQUVsRCxjQUFZLEtBQVosRUFBbUIsTUFBbkIsRUFBMkIsUUFBM0IsRUFBOEM7dUNBQU47O0tBQU07O0FBQzVDLFVBQU0sR0FBRyxJQUFILENBQU4sQ0FENEM7U0FEOUMsT0FBTyxnQkFDdUM7QUFFNUMsUUFBSSxDQUFDLE1BQUQsSUFBVyxDQUFDLFFBQUQsRUFBVztBQUN4QixXQUFLLE9BQUwsR0FBZSxDQUFDLG1CQUFELEdBQXNCLEtBQXRCLEVBQTRCLENBQTVCLENBQWYsQ0FEd0I7S0FBMUIsTUFFTztBQUNMLFdBQUssT0FBTCxHQUFlLENBQUMsV0FBRCxHQUFjLE1BQWQsRUFBcUIsaUJBQXJCLEdBQXdDLEtBQXhDLEVBQThDO29CQUE5QyxHQUViLE9BQU8sUUFBUCxLQUFvQixRQUFwQixHQUNFLENBQUMsQ0FBRCxHQUFJLFFBQUosRUFBYSxDQUFiLENBREYsR0FFTSxDQUFDLE9BQUQsR0FBVyxTQUFTLEdBQVQsQ0FBYSxLQUFLLENBQUMsQ0FBRCxHQUFJLENBQUosRUFBTSxDQUFOLENBQUwsQ0FBYixDQUE0QixJQUE1QixDQUFpQyxJQUFqQyxDQUFYLEVBQW1ELENBRnpELEVBR0QsQ0FMRCxDQURLO0tBRlA7R0FGRjtDQUZLOztRQUFNO0FBaUJOLE1BQU0scUJBQU4sU0FBb0MsaUJBQXBDLENBQXNEO0FBQzNELGNBQVksTUFBWixFQUFvQixRQUFwQixFQUF1Qzt1Q0FBTjs7S0FBTTs7QUFDckMsVUFBTSxZQUFOLEVBQW9CLE1BQXBCLEVBQTRCLFFBQTVCLEVBQXNDLEdBQUcsSUFBSCxDQUF0QyxDQURxQztHQUF2QztDQURLO1FBQU07QUFLTixNQUFNLHdCQUFOLFNBQXVDLGlCQUF2QyxDQUF5RDtBQUM5RCxjQUFZLE1BQVosRUFBb0IsUUFBcEIsRUFBdUM7dUNBQU47O0tBQU07O0FBQ3JDLFVBQU0sZUFBTixFQUF1QixNQUF2QixFQUErQixRQUEvQixFQUF5QyxHQUFHLElBQUgsQ0FBekMsQ0FEcUM7R0FBdkM7Q0FESzs7UUFBTTtBQU1OLE1BQU0sdUJBQU4sU0FBc0MsaUJBQXRDLENBQXdEOzs7OzhDQUM3RCxPQUFPLDRCQUNQLFVBQVU7R0FGbUQ7O0NBQXhEOztRQUFNO0FBS04sU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCLEtBQTdCLEVBQW9DO0FBQ3pDLE1BQUksTUFBTSxJQUFOLEtBQWUsT0FBTyxZQUFQLENBQWYsRUFBcUM7QUFDdkMsV0FBTyxNQUFNLE1BQU4sRUFBUCxDQUR1QztHQUF6QztBQUdBLFNBQU8sSUFBSSxZQUFKLENBQWlCLE1BQU0sT0FBTixDQUFqQixDQUFnQyxNQUFoQyxDQUF1QyxFQUFFLEtBQUYsRUFBdkMsQ0FBUCxDQUp5QztDQUFwQyIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgT0FVVEgyX0VSUk9SID0gU3ltYm9sKCdPQXV0aDIgRXJyb3InKTtcblxuZXhwb3J0IGNsYXNzIEdlbmVyaWNFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgbmFtZSA9ICdpbnZhbGlkX3JlcXVlc3QnO1xuICBzdGF0dXNDb2RlID0gNDAwO1xuICB0eXBlID0gT0FVVEgyX0VSUk9SO1xuICB0b0pTT04oeyBzdGF0ZSB9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycm9yOiB0aGlzLm5hbWUsXG4gICAgICBlcnJvcl9kZXNjcmlwdGlvbjogdGhpcy5tZXNzYWdlLFxuICAgICAgc3RhdGUsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWlzc2luZ0lucHV0RXJyb3IgZXh0ZW5kcyBHZW5lcmljRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihpbnB1dCwgLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLm1lc3NhZ2UgPSBgVGhlIHJlcXVpcmVkIHBhcmFtZXRlciAke3RoaXMuaW5wdXR9IGlzIG1pc3NpbmcuYDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW52YWxpZElucHV0RXJyb3IgZXh0ZW5kcyBHZW5lcmljRXJyb3Ige1xuICBuYW1lID0gJ0ludmFsaWQgSW5wdXQnO1xuICBjb25zdHJ1Y3RvcihwYXJhbSwgYWN0dWFsLCBleHBlY3RlZCwgLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgICAgdGhpcy5tZXNzYWdlID0gYEludmFsaWQgaW5wdXQgZm9yIFwiJHtwYXJhbX1cImA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWVzc2FnZSA9IGBUaGUgdmFsdWUgXCIke2FjdHVhbH1cIiBmb3IgcGFyYW1ldGVyIFwiJHtwYXJhbX1cIiBpcyBcXFxuaW52YWxpZCBhbmQgbXVzdCBiZSAke1xuICAgICAgICB0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnID9cbiAgICAgICAgICBgXCIke2V4cGVjdGVkfVwiYFxuICAgICAgICAgICAgOiBgb25lIG9mICR7IGV4cGVjdGVkLm1hcChzID0+IGBcIiR7c31cImApLmpvaW4oJywgJykgfWBcbiAgICAgIH1gO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW52YWxpZEdyYW50VHlwZUVycm9yIGV4dGVuZHMgSW52YWxpZElucHV0RXJyb3Ige1xuICBjb25zdHJ1Y3RvcihhY3R1YWwsIGV4cGVjdGVkLCAuLi5hcmdzKSB7XG4gICAgc3VwZXIoJ2dyYW50X3R5cGUnLCBhY3R1YWwsIGV4cGVjdGVkLCAuLi5hcmdzKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIEludmFsaWRSZXNwb25zZVR5cGVFcnJvciBleHRlbmRzIEludmFsaWRJbnB1dEVycm9yIHtcbiAgY29uc3RydWN0b3IoYWN0dWFsLCBleHBlY3RlZCwgLi4uYXJncykge1xuICAgIHN1cGVyKCdyZXNwb25zZV90eXBlJywgYWN0dWFsLCBleHBlY3RlZCwgLi4uYXJncyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludmFsaWRDcmVkZW50aWFsc0Vycm9yIGV4dGVuZHMgSW52YWxpZElucHV0RXJyb3Ige1xuICBuYW1lID0gJ0ludmFsaWQgQ3JlZGVudGlhbHMnO1xuICBtZXNzYWdlID0gJ0ludmFsaWQgdmFsdWVzIGZvciBcInBhc3N3b3JkXCIgb3IgXCJ1c2VybmFtZVwiJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvT0F1dGhFcnJvcihlcnJvciwgc3RhdGUpIHtcbiAgaWYgKGVycm9yLnR5cGUgPT09IE9iamVjdChPQVVUSDJfRVJST1IpKSB7XG4gICAgcmV0dXJuIGVycm9yLnRvSlNPTigpO1xuICB9XG4gIHJldHVybiBuZXcgR2VuZXJpY0Vycm9yKGVycm9yLm1lc3NhZ2UpLnRvSlNPTih7IHN0YXRlIH0pO1xufVxuIl19
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTokenRequest = exports.handleAuthorizationRequest = undefined;

var _constants = require('../constants');

var _errors = require('../errors');

var _querystring = require('querystring');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let handleAuthorizationRequest = exports.handleAuthorizationRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
    var _ctx$request$body = ctx.request.body;
    const response_type = _ctx$request$body.response_type;
    const client_id = _ctx$request$body.client_id;
    const scope = _ctx$request$body.scope;
    const state = _ctx$request$body.state;
    let redirect_uri = ctx.request.body.redirect_uri;

    if (response_type !== 'code') {
      return next();
    }
    var _ctx$MODEL = ctx[_constants.MODEL];
    const isClientValid = _ctx$MODEL.isClientValid;
    const createAuthorizationCode = _ctx$MODEL.createAuthorizationCode;
    const isRedirectUriValid = _ctx$MODEL.isRedirectUriValid;
    const getRedirectUri = _ctx$MODEL.getRedirectUri;

    if (!client_id || !String(client_id).length || (yield isClientValid({ client_id })) === false) {
      throw new _errors.InvalidInputError('client_id');
    }
    if (!!redirect_uri && redirect_uri.length) {
      if ((yield isRedirectUriValid({ client_id, redirect_uri })) === false) {
        throw new _errors.InvalidInputError('redirect_uri');
      }
    } else {
      redirect_uri = yield getRedirectUri({ client_id });
    }
    let query;
    try {
      const code = yield createAuthorizationCode({
        client_id, scope, state, redirect_uri
      });
      query = { code };
      if (state) query.state = state;
    } catch (e) {
      query = (0, _errors.toOAuthError)(e, state);
    } finally {
      ctx.redirect(`${ redirect_uri }?${ (0, _querystring.stringify)(query) }`);
    }
  });
  return function handleAuthorizationRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

let handleTokenRequest = exports.handleTokenRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
    var _ctx$request$body2 = ctx.request.body;
    const grant_type = _ctx$request$body2.grant_type;
    const clientId = _ctx$request$body2.clientId;
    const client_secret = _ctx$request$body2.client_secret;
    const ttl = _ctx$request$body2.ttl;
    const scope = _ctx$request$body2.scope;
    const code = _ctx$request$body2.code;

    if (grant_type !== 'authorization_code') {
      return next();
    }
    var _ctx$MODEL2 = ctx[_constants.MODEL];
    const isClientSecretValid = _ctx$MODEL2.isClientSecretValid;
    const createAccessToken = _ctx$MODEL2.createAccessToken;

    if (!code || !String(code).length) {
      throw new _errors.MissingInputError('code');
    }
    if (!client_secret || !String(client_secret).length) {
      throw new _errors.MissingInputError('client_secret');
    }
    if ((yield isClientSecretValid({ clientId, client_secret })) === false) {
      throw new _errors.InvalidInputError('client_secret');
    }
    const token = yield createAccessToken({
      clientId, scope, ttl,
      createRefreshToken: true
    });
    ctx.body = token;
  });
  return function handleTokenRequest(_x3, _x4) {
    return ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGhvcml6YXRpb25fY29kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0Q0FLTyxXQUEwQyxHQUExQyxFQUErQyxJQUEvQyxFQUFxRDs0QkFHdEQsSUFBSSxPQUFKLENBQVksSUFBWixDQUhzRDtVQUV4RCxnREFGd0Q7VUFFekMsd0NBRnlDO1VBRTlCLGdDQUY4QjtVQUV2QixnQ0FGdUI7UUFJcEQsZUFBaUIsSUFBSSxPQUFKLENBQVksSUFBWixDQUFqQixhQUpvRDs7QUFLMUQsUUFBSSxrQkFBa0IsTUFBbEIsRUFBMEI7QUFDNUIsYUFBTyxNQUFQLENBRDRCO0tBQTlCO3FCQUl5QyxzQkFUaUI7VUFRbEQseUNBUmtEO1VBUW5DLDZEQVJtQztVQVN4RCxtREFUd0Q7VUFTcEMsMkNBVG9DOztBQVUxRCxRQUFJLENBQUMsU0FBRCxJQUFjLENBQUMsT0FBTyxTQUFQLEVBQWtCLE1BQWxCLElBQ2QsT0FBTSxjQUFjLEVBQUUsU0FBRixFQUFkLENBQU4sTUFBdUMsS0FBdkMsRUFBOEM7QUFDakQsWUFBTSw4QkFBc0IsV0FBdEIsQ0FBTixDQURpRDtLQURuRDtBQUlBLFFBQUksQ0FBQyxDQUFDLFlBQUQsSUFBaUIsYUFBYSxNQUFiLEVBQXFCO0FBQ3pDLFVBQUksT0FBTSxtQkFBbUIsRUFBRSxTQUFGLEVBQWEsWUFBYixFQUFuQixDQUFOLE1BQTBELEtBQTFELEVBQWlFO0FBQ25FLGNBQU0sOEJBQXNCLGNBQXRCLENBQU4sQ0FEbUU7T0FBckU7S0FERixNQUlPO0FBQ0wscUJBQWUsTUFBTSxlQUFlLEVBQUUsU0FBRixFQUFmLENBQU4sQ0FEVjtLQUpQO0FBT0EsUUFBSSxLQUFKLENBckIwRDtBQXNCMUQsUUFBSTtBQUNGLFlBQU0sT0FBTyxNQUFNLHdCQUF3QjtBQUN6QyxpQkFEeUMsRUFDOUIsS0FEOEIsRUFDdkIsS0FEdUIsRUFDaEIsWUFEZ0I7T0FBeEIsQ0FBTixDQURYO0FBSUYsY0FBUSxFQUFFLElBQUYsRUFBUixDQUpFO0FBS0YsVUFBSSxLQUFKLEVBQVcsTUFBTSxLQUFOLEdBQWMsS0FBZCxDQUFYO0tBTEYsQ0FNRSxPQUFPLENBQVAsRUFBVTtBQUNWLGNBQVEsMEJBQWEsQ0FBYixFQUFnQixLQUFoQixDQUFSLENBRFU7S0FBVixTQUVRO0FBQ1IsVUFBSSxRQUFKLENBQWEsQ0FBQyxHQUFFLFlBQUgsRUFBZ0IsQ0FBaEIsR0FBbUIsNEJBQVUsS0FBVixDQUFuQixFQUFvQyxDQUFqRCxFQURRO0tBUlY7R0F0Qks7a0JBQWU7Ozs7Ozs0Q0FtQ2YsV0FBa0MsR0FBbEMsRUFBdUMsSUFBdkMsRUFBNkM7NkJBSTlDLElBQUksT0FBSixDQUFZLElBQVosQ0FKOEM7VUFFaEQsMkNBRmdEO1VBRXBDLHVDQUZvQztVQUUxQixpREFGMEI7VUFHaEQsNkJBSGdEO1VBRzNDLGlDQUgyQztVQUdwQywrQkFIb0M7O0FBS2xELFFBQUksZUFBZSxvQkFBZixFQUFxQztBQUN2QyxhQUFPLE1BQVAsQ0FEdUM7S0FBekM7c0JBR21ELHNCQVJEO1VBUTFDLHNEQVIwQztVQVFyQixrREFScUI7O0FBU2xELFFBQUksQ0FBQyxJQUFELElBQVMsQ0FBQyxPQUFPLElBQVAsRUFBYSxNQUFiLEVBQXFCO0FBQ2pDLFlBQU0sOEJBQXNCLE1BQXRCLENBQU4sQ0FEaUM7S0FBbkM7QUFHQSxRQUFJLENBQUMsYUFBRCxJQUFrQixDQUFDLE9BQU8sYUFBUCxFQUFzQixNQUF0QixFQUE4QjtBQUNuRCxZQUFNLDhCQUFzQixlQUF0QixDQUFOLENBRG1EO0tBQXJEO0FBR0EsUUFBSSxPQUFNLG9CQUFvQixFQUFFLFFBQUYsRUFBWSxhQUFaLEVBQXBCLENBQU4sTUFBMkQsS0FBM0QsRUFBa0U7QUFDcEUsWUFBTSw4QkFBc0IsZUFBdEIsQ0FBTixDQURvRTtLQUF0RTtBQUdBLFVBQU0sUUFBUSxNQUFNLGtCQUFrQjtBQUNwQyxjQURvQyxFQUMxQixLQUQwQixFQUNuQixHQURtQjtBQUVwQywwQkFBb0IsSUFBcEI7S0FGa0IsQ0FBTixDQWxCb0M7QUFzQmxELFFBQUksSUFBSixHQUFXLEtBQVgsQ0F0QmtEO0dBQTdDO2tCQUFlIiwiZmlsZSI6ImF1dGhvcml6YXRpb25fY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1PREVMIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IEludmFsaWRJbnB1dEVycm9yLFxuICBNaXNzaW5nSW5wdXRFcnJvciwgdG9PQXV0aEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUF1dGhvcml6YXRpb25SZXF1ZXN0KGN0eCwgbmV4dCkge1xuICBjb25zdCB7XG4gICAgcmVzcG9uc2VfdHlwZSwgY2xpZW50X2lkLCBzY29wZSwgc3RhdGUsXG4gIH0gPSBjdHgucmVxdWVzdC5ib2R5O1xuICBsZXQgeyByZWRpcmVjdF91cmkgfSA9IGN0eC5yZXF1ZXN0LmJvZHk7XG4gIGlmIChyZXNwb25zZV90eXBlICE9PSAnY29kZScpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGNvbnN0IHsgaXNDbGllbnRWYWxpZCwgY3JlYXRlQXV0aG9yaXphdGlvbkNvZGUsXG4gICAgaXNSZWRpcmVjdFVyaVZhbGlkLCBnZXRSZWRpcmVjdFVyaSB9ID0gY3R4W01PREVMXTtcbiAgaWYgKCFjbGllbnRfaWQgfHwgIVN0cmluZyhjbGllbnRfaWQpLmxlbmd0aFxuICAgIHx8IGF3YWl0IGlzQ2xpZW50VmFsaWQoeyBjbGllbnRfaWQgfSkgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRJbnB1dEVycm9yKCdjbGllbnRfaWQnKTtcbiAgfVxuICBpZiAoISFyZWRpcmVjdF91cmkgJiYgcmVkaXJlY3RfdXJpLmxlbmd0aCkge1xuICAgIGlmIChhd2FpdCBpc1JlZGlyZWN0VXJpVmFsaWQoeyBjbGllbnRfaWQsIHJlZGlyZWN0X3VyaSB9KSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkSW5wdXRFcnJvcigncmVkaXJlY3RfdXJpJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlZGlyZWN0X3VyaSA9IGF3YWl0IGdldFJlZGlyZWN0VXJpKHsgY2xpZW50X2lkIH0pO1xuICB9XG4gIGxldCBxdWVyeTtcbiAgdHJ5IHtcbiAgICBjb25zdCBjb2RlID0gYXdhaXQgY3JlYXRlQXV0aG9yaXphdGlvbkNvZGUoe1xuICAgICAgY2xpZW50X2lkLCBzY29wZSwgc3RhdGUsIHJlZGlyZWN0X3VyaSxcbiAgICB9KTtcbiAgICBxdWVyeSA9IHsgY29kZSB9O1xuICAgIGlmIChzdGF0ZSkgcXVlcnkuc3RhdGUgPSBzdGF0ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHF1ZXJ5ID0gdG9PQXV0aEVycm9yKGUsIHN0YXRlKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjdHgucmVkaXJlY3QoYCR7cmVkaXJlY3RfdXJpfT8ke3N0cmluZ2lmeShxdWVyeSl9YCk7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVRva2VuUmVxdWVzdChjdHgsIG5leHQpIHtcbiAgY29uc3Qge1xuICAgIGdyYW50X3R5cGUsIGNsaWVudElkLCBjbGllbnRfc2VjcmV0LFxuICAgIHR0bCwgc2NvcGUsIGNvZGUsXG4gIH0gPSBjdHgucmVxdWVzdC5ib2R5O1xuICBpZiAoZ3JhbnRfdHlwZSAhPT0gJ2F1dGhvcml6YXRpb25fY29kZScpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGNvbnN0IHsgaXNDbGllbnRTZWNyZXRWYWxpZCwgY3JlYXRlQWNjZXNzVG9rZW4gfSA9IGN0eFtNT0RFTF07XG4gIGlmICghY29kZSB8fCAhU3RyaW5nKGNvZGUpLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBNaXNzaW5nSW5wdXRFcnJvcignY29kZScpO1xuICB9XG4gIGlmICghY2xpZW50X3NlY3JldCB8fCAhU3RyaW5nKGNsaWVudF9zZWNyZXQpLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBNaXNzaW5nSW5wdXRFcnJvcignY2xpZW50X3NlY3JldCcpO1xuICB9XG4gIGlmIChhd2FpdCBpc0NsaWVudFNlY3JldFZhbGlkKHsgY2xpZW50SWQsIGNsaWVudF9zZWNyZXQgfSkgPT09IGZhbHNlKSB7XG4gICAgdGhyb3cgbmV3IEludmFsaWRJbnB1dEVycm9yKCdjbGllbnRfc2VjcmV0Jyk7XG4gIH1cbiAgY29uc3QgdG9rZW4gPSBhd2FpdCBjcmVhdGVBY2Nlc3NUb2tlbih7XG4gICAgY2xpZW50SWQsIHNjb3BlLCB0dGwsXG4gICAgY3JlYXRlUmVmcmVzaFRva2VuOiB0cnVlLFxuICB9KTtcbiAgY3R4LmJvZHkgPSB0b2tlbjtcbn1cbiJdfQ==
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTokenRequest = undefined;

var _constants = require('../constants');

var _errors = require('../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let handleTokenRequest = exports.handleTokenRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
    var _ctx$request$body = ctx.request.body;
    const grant_type = _ctx$request$body.grant_type;
    const client_id = _ctx$request$body.client_id;
    const client_secret = _ctx$request$body.client_secret;
    const scope = _ctx$request$body.scope;
    const ttl = _ctx$request$body.ttl;
    const state = _ctx$request$body.state;

    if (grant_type !== 'client_credentials') {
      return next();
    }
    var _ctx$MODEL = ctx[_constants.MODEL];
    const createAccessToken = _ctx$MODEL.createAccessToken;
    const isClientSecretValid = _ctx$MODEL.isClientSecretValid;

    if ((yield isClientSecretValid({ client_id, client_secret })) === false) {
      throw new _errors.InvalidInputError('client_secret');
    }
    const token = yield createAccessToken({
      client_id, scope, state, ttl,
      createRefreshToken: true
    });
    ctx.body = token;
  });
  return function handleTokenRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudF9jcmVkZW50aWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NENBR08sV0FBa0MsR0FBbEMsRUFBdUMsSUFBdkMsRUFBNkM7NEJBSTlDLElBQUksT0FBSixDQUFZLElBQVosQ0FKOEM7VUFFaEQsMENBRmdEO1VBRXBDLHdDQUZvQztVQUV6QixnREFGeUI7VUFHaEQsZ0NBSGdEO1VBR3pDLDRCQUh5QztVQUdwQyxnQ0FIb0M7O0FBS2xELFFBQUksZUFBZSxvQkFBZixFQUFxQztBQUN2QyxhQUFPLE1BQVAsQ0FEdUM7S0FBekM7cUJBR21ELHNCQVJEO1VBUTFDLGlEQVIwQztVQVF2QixxREFSdUI7O0FBU2xELFFBQUksT0FBTSxvQkFBb0IsRUFBRSxTQUFGLEVBQWEsYUFBYixFQUFwQixDQUFOLE1BQTRELEtBQTVELEVBQW1FO0FBQ3JFLFlBQU0sOEJBQXNCLGVBQXRCLENBQU4sQ0FEcUU7S0FBdkU7QUFHQSxVQUFNLFFBQVEsTUFBTSxrQkFBa0I7QUFDcEMsZUFEb0MsRUFDekIsS0FEeUIsRUFDbEIsS0FEa0IsRUFDWCxHQURXO0FBRXBDLDBCQUFvQixJQUFwQjtLQUZrQixDQUFOLENBWm9DO0FBZ0JsRCxRQUFJLElBQUosR0FBVyxLQUFYLENBaEJrRDtHQUE3QztrQkFBZSIsImZpbGUiOiJjbGllbnRfY3JlZGVudGlhbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNT0RFTCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBJbnZhbGlkSW5wdXRFcnJvciB9IGZyb20gJy4uL2Vycm9ycyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVUb2tlblJlcXVlc3QoY3R4LCBuZXh0KSB7XG4gIGNvbnN0IHtcbiAgICBncmFudF90eXBlLCBjbGllbnRfaWQsIGNsaWVudF9zZWNyZXQsXG4gICAgc2NvcGUsIHR0bCwgc3RhdGUsXG4gIH0gPSBjdHgucmVxdWVzdC5ib2R5O1xuICBpZiAoZ3JhbnRfdHlwZSAhPT0gJ2NsaWVudF9jcmVkZW50aWFscycpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGNvbnN0IHsgY3JlYXRlQWNjZXNzVG9rZW4sIGlzQ2xpZW50U2VjcmV0VmFsaWQgfSA9IGN0eFtNT0RFTF07XG4gIGlmIChhd2FpdCBpc0NsaWVudFNlY3JldFZhbGlkKHsgY2xpZW50X2lkLCBjbGllbnRfc2VjcmV0IH0pID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBJbnZhbGlkSW5wdXRFcnJvcignY2xpZW50X3NlY3JldCcpO1xuICB9XG4gIGNvbnN0IHRva2VuID0gYXdhaXQgY3JlYXRlQWNjZXNzVG9rZW4oe1xuICAgIGNsaWVudF9pZCwgc2NvcGUsIHN0YXRlLCB0dGwsXG4gICAgY3JlYXRlUmVmcmVzaFRva2VuOiB0cnVlLFxuICB9KTtcbiAgY3R4LmJvZHkgPSB0b2tlbjtcbn1cbiJdfQ==
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizationHandlers = exports.tokenHandlers = undefined;

var _authorization_code = require('./authorization_code');

var authorizationCode = _interopRequireWildcard(_authorization_code);

var _client_credentials = require('./client_credentials');

var clientCredentials = _interopRequireWildcard(_client_credentials);

var _password = require('./password');

var password = _interopRequireWildcard(_password);

var _token = require('./token');

var token = _interopRequireWildcard(_token);

var _refresh_token = require('./refresh_token');

var refreshToken = _interopRequireWildcard(_refresh_token);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const tokenHandlers = exports.tokenHandlers = [token, authorizationCode, password, clientCredentials, refreshToken].map(h => h.handleTokenRequest);

const authorizationHandlers = exports.authorizationHandlers = [authorizationCode].map(h => h.handleAuthorizationRequest);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztJQUFZOzs7O0lBQ0E7Ozs7SUFDQTs7OztJQUNBOzs7O0lBQ0E7Ozs7QUFFTCxNQUFNLHdDQUFnQixDQUMzQixLQUQyQixFQUUzQixpQkFGMkIsRUFHM0IsUUFIMkIsRUFJM0IsaUJBSjJCLEVBSzNCLFlBTDJCLEVBTTNCLEdBTjJCLENBTXZCLEtBQUssRUFBRSxrQkFBRixDQU5FOztBQVFOLE1BQU0sd0RBQXdCLENBQ25DLGlCQURtQyxFQUVuQyxHQUZtQyxDQUUvQixLQUFLLEVBQUUsMEJBQUYsQ0FGRSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1dGhvcml6YXRpb25Db2RlIGZyb20gJy4vYXV0aG9yaXphdGlvbl9jb2RlJztcbmltcG9ydCAqIGFzIGNsaWVudENyZWRlbnRpYWxzIGZyb20gJy4vY2xpZW50X2NyZWRlbnRpYWxzJztcbmltcG9ydCAqIGFzIHBhc3N3b3JkIGZyb20gJy4vcGFzc3dvcmQnO1xuaW1wb3J0ICogYXMgdG9rZW4gZnJvbSAnLi90b2tlbic7XG5pbXBvcnQgKiBhcyByZWZyZXNoVG9rZW4gZnJvbSAnLi9yZWZyZXNoX3Rva2VuJztcblxuZXhwb3J0IGNvbnN0IHRva2VuSGFuZGxlcnMgPSBbXG4gIHRva2VuLFxuICBhdXRob3JpemF0aW9uQ29kZSxcbiAgcGFzc3dvcmQsXG4gIGNsaWVudENyZWRlbnRpYWxzLFxuICByZWZyZXNoVG9rZW4sXG5dLm1hcChoID0+IGguaGFuZGxlVG9rZW5SZXF1ZXN0KTtcblxuZXhwb3J0IGNvbnN0IGF1dGhvcml6YXRpb25IYW5kbGVycyA9IFtcbiAgYXV0aG9yaXphdGlvbkNvZGUsXG5dLm1hcChoID0+IGguaGFuZGxlQXV0aG9yaXphdGlvblJlcXVlc3QpO1xuIl19
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTokenRequest = undefined;

var _errors = require('../errors');

var _constants = require('../constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let handleTokenRequest = exports.handleTokenRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
    var _ctx$request$body = ctx.request.body;
    const grant_type = _ctx$request$body.grant_type;
    const username = _ctx$request$body.username;
    const password = _ctx$request$body.password;
    const scope = _ctx$request$body.scope;
    const client_id = _ctx$request$body.client_id;
    const state = _ctx$request$body.state;
    const ttl = _ctx$request$body.ttl;

    if (grant_type !== 'password') {
      return next();
    }
    const createAccessToken = ctx[_constants.MODEL].createAccessToken;

    if (!password || !String(password).length) {
      throw new _errors.MissingInputError('password');
    }
    if (!username || !String(username).length) {
      throw new _errors.MissingInputError('username');
    }
    const token = yield createAccessToken({
      client_id, scope, state, ttl,
      createRefreshToken: true
    });
    ctx.body = token;
  });
  return function handleTokenRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhc3N3b3JkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0Q0FJTyxXQUFrQyxHQUFsQyxFQUF1QyxJQUF2QyxFQUE2Qzs0QkFJOUMsSUFBSSxPQUFKLENBQVksSUFBWixDQUo4QztVQUVoRCwwQ0FGZ0Q7VUFFcEMsc0NBRm9DO1VBRTFCLHNDQUYwQjtVQUVoQixnQ0FGZ0I7VUFHaEQsd0NBSGdEO1VBR3JDLGdDQUhxQztVQUc5Qiw0QkFIOEI7O0FBS2xELFFBQUksZUFBZSxVQUFmLEVBQTJCO0FBQzdCLGFBQU8sTUFBUCxDQUQ2QjtLQUEvQjtVQUdRLG9CQUFzQixzQkFBdEIsa0JBUjBDOztBQVNsRCxRQUFJLENBQUMsUUFBRCxJQUFhLENBQUMsT0FBTyxRQUFQLEVBQWlCLE1BQWpCLEVBQXlCO0FBQ3pDLFlBQU0sOEJBQXNCLFVBQXRCLENBQU4sQ0FEeUM7S0FBM0M7QUFHQSxRQUFJLENBQUMsUUFBRCxJQUFhLENBQUMsT0FBTyxRQUFQLEVBQWlCLE1BQWpCLEVBQXlCO0FBQ3pDLFlBQU0sOEJBQXNCLFVBQXRCLENBQU4sQ0FEeUM7S0FBM0M7QUFHQSxVQUFNLFFBQVEsTUFBTSxrQkFBa0I7QUFDcEMsZUFEb0MsRUFDekIsS0FEeUIsRUFDbEIsS0FEa0IsRUFDWCxHQURXO0FBRXBDLDBCQUFvQixJQUFwQjtLQUZrQixDQUFOLENBZm9DO0FBbUJsRCxRQUFJLElBQUosR0FBVyxLQUFYLENBbkJrRDtHQUE3QztrQkFBZSIsImZpbGUiOiJwYXNzd29yZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1pc3NpbmdJbnB1dEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzJztcblxuaW1wb3J0IHsgTU9ERUwgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlVG9rZW5SZXF1ZXN0KGN0eCwgbmV4dCkge1xuICBjb25zdCB7XG4gICAgZ3JhbnRfdHlwZSwgdXNlcm5hbWUsIHBhc3N3b3JkLCBzY29wZSxcbiAgICBjbGllbnRfaWQsIHN0YXRlLCB0dGwsXG4gIH0gPSBjdHgucmVxdWVzdC5ib2R5O1xuICBpZiAoZ3JhbnRfdHlwZSAhPT0gJ3Bhc3N3b3JkJykge1xuICAgIHJldHVybiBuZXh0KCk7XG4gIH1cbiAgY29uc3QgeyBjcmVhdGVBY2Nlc3NUb2tlbiB9ID0gY3R4W01PREVMXTtcbiAgaWYgKCFwYXNzd29yZCB8fCAhU3RyaW5nKHBhc3N3b3JkKS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgTWlzc2luZ0lucHV0RXJyb3IoJ3Bhc3N3b3JkJyk7XG4gIH1cbiAgaWYgKCF1c2VybmFtZSB8fCAhU3RyaW5nKHVzZXJuYW1lKS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgTWlzc2luZ0lucHV0RXJyb3IoJ3VzZXJuYW1lJyk7XG4gIH1cbiAgY29uc3QgdG9rZW4gPSBhd2FpdCBjcmVhdGVBY2Nlc3NUb2tlbih7XG4gICAgY2xpZW50X2lkLCBzY29wZSwgc3RhdGUsIHR0bCxcbiAgICBjcmVhdGVSZWZyZXNoVG9rZW46IHRydWUsXG4gIH0pO1xuICBjdHguYm9keSA9IHRva2VuO1xufVxuIl19
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTokenRequest = undefined;

var _constants = require('../constants');

var _errors = require('../errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let handleTokenRequest = exports.handleTokenRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
    var _ctx$request$body = ctx.request.body;
    const grant_type = _ctx$request$body.grant_type;
    const client_id = _ctx$request$body.client_id;
    const ttl = _ctx$request$body.ttl;
    const scope = _ctx$request$body.scope;
    const state = _ctx$request$body.state;
    const refresh_token = _ctx$request$body.refresh_token;

    if (grant_type !== 'refresh_token') {
      return next();
    }
    const createAccessToken = ctx[_constants.MODEL].createAccessToken;

    if (!refresh_token || !String(refresh_token).length) {
      throw new _errors.MissingInputError('refresh_token');
    }
    if (!client_id || !String(client_id).length) {
      throw new _errors.MissingInputError('client_id');
    }
    const token = yield createAccessToken({
      client_id, scope, state, ttl,
      createRefreshToken: true
    });
    ctx.body = token;
  });
  return function handleTokenRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZnJlc2hfdG9rZW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQUdPLFdBQWtDLEdBQWxDLEVBQXVDLElBQXZDLEVBQTZDOzRCQUs5QyxJQUFJLE9BQUosQ0FBWSxJQUFaLENBTDhDO1VBRWhELDBDQUZnRDtVQUVwQyx3Q0FGb0M7VUFHaEQsNEJBSGdEO1VBRzNDLGdDQUgyQztVQUdwQyxnQ0FIb0M7VUFJaEQsZ0RBSmdEOztBQU1sRCxRQUFJLGVBQWUsZUFBZixFQUFnQztBQUNsQyxhQUFPLE1BQVAsQ0FEa0M7S0FBcEM7VUFHUSxvQkFBc0Isc0JBQXRCLGtCQVQwQzs7QUFVbEQsUUFBSSxDQUFDLGFBQUQsSUFBa0IsQ0FBQyxPQUFPLGFBQVAsRUFBc0IsTUFBdEIsRUFBOEI7QUFDbkQsWUFBTSw4QkFBc0IsZUFBdEIsQ0FBTixDQURtRDtLQUFyRDtBQUdBLFFBQUksQ0FBQyxTQUFELElBQWMsQ0FBQyxPQUFPLFNBQVAsRUFBa0IsTUFBbEIsRUFBMEI7QUFDM0MsWUFBTSw4QkFBc0IsV0FBdEIsQ0FBTixDQUQyQztLQUE3QztBQUdBLFVBQU0sUUFBUSxNQUFNLGtCQUFrQjtBQUNwQyxlQURvQyxFQUN6QixLQUR5QixFQUNsQixLQURrQixFQUNYLEdBRFc7QUFFcEMsMEJBQW9CLElBQXBCO0tBRmtCLENBQU4sQ0FoQm9DO0FBb0JsRCxRQUFJLElBQUosR0FBVyxLQUFYLENBcEJrRDtHQUE3QztrQkFBZSIsImZpbGUiOiJyZWZyZXNoX3Rva2VuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTU9ERUwgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgTWlzc2luZ0lucHV0RXJyb3IgfSBmcm9tICcuLi9lcnJvcnMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlVG9rZW5SZXF1ZXN0KGN0eCwgbmV4dCkge1xuICBjb25zdCB7XG4gICAgZ3JhbnRfdHlwZSwgY2xpZW50X2lkLFxuICAgIHR0bCwgc2NvcGUsIHN0YXRlLFxuICAgIHJlZnJlc2hfdG9rZW4sXG4gIH0gPSBjdHgucmVxdWVzdC5ib2R5O1xuICBpZiAoZ3JhbnRfdHlwZSAhPT0gJ3JlZnJlc2hfdG9rZW4nKSB7XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfVxuICBjb25zdCB7IGNyZWF0ZUFjY2Vzc1Rva2VuIH0gPSBjdHhbTU9ERUxdO1xuICBpZiAoIXJlZnJlc2hfdG9rZW4gfHwgIVN0cmluZyhyZWZyZXNoX3Rva2VuKS5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgTWlzc2luZ0lucHV0RXJyb3IoJ3JlZnJlc2hfdG9rZW4nKTtcbiAgfVxuICBpZiAoIWNsaWVudF9pZCB8fCAhU3RyaW5nKGNsaWVudF9pZCkubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IE1pc3NpbmdJbnB1dEVycm9yKCdjbGllbnRfaWQnKTtcbiAgfVxuICBjb25zdCB0b2tlbiA9IGF3YWl0IGNyZWF0ZUFjY2Vzc1Rva2VuKHtcbiAgICBjbGllbnRfaWQsIHNjb3BlLCBzdGF0ZSwgdHRsLFxuICAgIGNyZWF0ZVJlZnJlc2hUb2tlbjogdHJ1ZSxcbiAgfSk7XG4gIGN0eC5ib2R5ID0gdG9rZW47XG59XG4iXX0=
'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTokenRequest = undefined;

var _constants = require('../constants');

var _errors = require('../errors');

var _querystring = require('querystring');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let handleTokenRequest = exports.handleTokenRequest = function () {
  var ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
    var _ctx$request$body = ctx.request.body;
    const response_type = _ctx$request$body.response_type;
    const client_id = _ctx$request$body.client_id;
    const redirect_uri = _ctx$request$body.redirect_uri;
    const scope = _ctx$request$body.scope;
    const ttl = _ctx$request$body.ttl;
    const state = _ctx$request$body.state;

    if (response_type !== 'token') {
      return next();
    }
    const createAccessToken = ctx[_constants.MODEL].createAccessToken;

    let query;
    try {
      const token = yield createAccessToken({
        client_id, scope, state, ttl,
        createRefreshToken: true
      });
      query = (0, _querystring.stringify)(token);
    } catch (e) {
      query = (0, _querystring.stringify)((0, _errors.toOAuthError)(e, { state }));
    } finally {
      ctx.redirect(`${ redirect_uri }?${ query }`);
    }
  });
  return function handleTokenRequest(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRva2VuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQUlPLFdBQWtDLEdBQWxDLEVBQXVDLElBQXZDLEVBQTZDOzRCQUk5QyxJQUFJLE9BQUosQ0FBWSxJQUFaLENBSjhDO1VBRWhELGdEQUZnRDtVQUVqQyx3Q0FGaUM7VUFFdEIsOENBRnNCO1VBR2hELGdDQUhnRDtVQUd6Qyw0QkFIeUM7VUFHcEMsZ0NBSG9DOztBQUtsRCxRQUFJLGtCQUFrQixPQUFsQixFQUEyQjtBQUM3QixhQUFPLE1BQVAsQ0FENkI7S0FBL0I7VUFHUSxvQkFBc0Isc0JBQXRCLGtCQVIwQzs7QUFTbEQsUUFBSSxLQUFKLENBVGtEO0FBVWxELFFBQUk7QUFDRixZQUFNLFFBQVEsTUFBTSxrQkFBa0I7QUFDcEMsaUJBRG9DLEVBQ3pCLEtBRHlCLEVBQ2xCLEtBRGtCLEVBQ1gsR0FEVztBQUVwQyw0QkFBb0IsSUFBcEI7T0FGa0IsQ0FBTixDQURaO0FBS0YsY0FBUSw0QkFBVSxLQUFWLENBQVIsQ0FMRTtLQUFKLENBTUUsT0FBTyxDQUFQLEVBQVU7QUFDVixjQUFRLDRCQUFVLDBCQUFhLENBQWIsRUFBZ0IsRUFBRSxLQUFGLEVBQWhCLENBQVYsQ0FBUixDQURVO0tBQVYsU0FFUTtBQUNSLFVBQUksUUFBSixDQUFhLENBQUMsR0FBRSxZQUFILEVBQWdCLENBQWhCLEdBQW1CLEtBQW5CLEVBQXlCLENBQXRDLEVBRFE7S0FSVjtHQVZLO2tCQUFlIiwiZmlsZSI6InRva2VuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTU9ERUwgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgdG9PQXV0aEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7IHN0cmluZ2lmeSB9IGZyb20gJ3F1ZXJ5c3RyaW5nJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZVRva2VuUmVxdWVzdChjdHgsIG5leHQpIHtcbiAgY29uc3Qge1xuICAgIHJlc3BvbnNlX3R5cGUsIGNsaWVudF9pZCwgcmVkaXJlY3RfdXJpLFxuICAgIHNjb3BlLCB0dGwsIHN0YXRlLFxuICB9ID0gY3R4LnJlcXVlc3QuYm9keTtcbiAgaWYgKHJlc3BvbnNlX3R5cGUgIT09ICd0b2tlbicpIHtcbiAgICByZXR1cm4gbmV4dCgpO1xuICB9XG4gIGNvbnN0IHsgY3JlYXRlQWNjZXNzVG9rZW4gfSA9IGN0eFtNT0RFTF07XG4gIGxldCBxdWVyeTtcbiAgdHJ5IHtcbiAgICBjb25zdCB0b2tlbiA9IGF3YWl0IGNyZWF0ZUFjY2Vzc1Rva2VuKHtcbiAgICAgIGNsaWVudF9pZCwgc2NvcGUsIHN0YXRlLCB0dGwsXG4gICAgICBjcmVhdGVSZWZyZXNoVG9rZW46IHRydWUsXG4gICAgfSk7XG4gICAgcXVlcnkgPSBzdHJpbmdpZnkodG9rZW4pO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcXVlcnkgPSBzdHJpbmdpZnkodG9PQXV0aEVycm9yKGUsIHsgc3RhdGUgfSkpO1xuICB9IGZpbmFsbHkge1xuICAgIGN0eC5yZWRpcmVjdChgJHtyZWRpcmVjdF91cml9PyR7cXVlcnl9YCk7XG4gIH1cbn1cbiJdfQ==
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _handlers = require('./handlers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _koaRouter2.default();

// router.get('/authorize', async (ctx) => {

// });

router.post('/authorize', ..._handlers.authorizationHandlers);

router.post('/token', ..._handlers.tokenHandlers);

// router.get('/revoke', async (ctx) => {

// });

exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU0sU0FBUyx5QkFBVDs7Ozs7O0FBTU4sT0FBTyxJQUFQLENBQVksWUFBWixFQUEwQixrQ0FBMUI7O0FBRUEsT0FBTyxJQUFQLENBQVksUUFBWixFQUFzQiwwQkFBdEI7Ozs7OztrQkFNZSIsImZpbGUiOiJyb3V0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUm91dGVyIGZyb20gJ2tvYS1yb3V0ZXInO1xuaW1wb3J0IHsgdG9rZW5IYW5kbGVycywgYXV0aG9yaXphdGlvbkhhbmRsZXJzIH0gZnJvbSAnLi9oYW5kbGVycyc7XG5cbmNvbnN0IHJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcblxuLy8gcm91dGVyLmdldCgnL2F1dGhvcml6ZScsIGFzeW5jIChjdHgpID0+IHtcblxuLy8gfSk7XG5cbnJvdXRlci5wb3N0KCcvYXV0aG9yaXplJywgLi4uYXV0aG9yaXphdGlvbkhhbmRsZXJzKTtcblxucm91dGVyLnBvc3QoJy90b2tlbicsIC4uLnRva2VuSGFuZGxlcnMpO1xuXG4vLyByb3V0ZXIuZ2V0KCcvcmV2b2tlJywgYXN5bmMgKGN0eCkgPT4ge1xuXG4vLyB9KTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xuIl19
'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _router = require('../router');

var _router2 = _interopRequireDefault(_router);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = new _koa2.default();
server.use((0, _koaBodyparser2.default)());
server.use(_router2.default.routes());
server.listen(4000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBTSxTQUFTLG1CQUFUO0FBQ04sT0FBTyxHQUFQLENBQVcsOEJBQVg7QUFDQSxPQUFPLEdBQVAsQ0FBVyxpQkFBTyxNQUFQLEVBQVg7QUFDQSxPQUFPLE1BQVAsQ0FBYyxJQUFkIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLb2EgZnJvbSAna29hJztcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi4vcm91dGVyJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2tvYS1ib2R5cGFyc2VyJztcbmNvbnN0IHNlcnZlciA9IG5ldyBLb2EoKTtcbnNlcnZlci51c2UoYm9keVBhcnNlcigpKTtcbnNlcnZlci51c2Uocm91dGVyLnJvdXRlcygpKTtcbnNlcnZlci5saXN0ZW4oNDAwMCk7XG4iXX0=
'use strict';

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _router = require('../router');

var _router2 = _interopRequireDefault(_router);

var _koaBodyparser = require('koa-bodyparser');

var _koaBodyparser2 = _interopRequireDefault(_koaBodyparser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = new _koa2.default();
server.use((0, _koaBodyparser2.default)());
server.use(_router2.default.routes());
server.listen(4000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsTUFBTSxTQUFTLG1CQUFUO0FBQ04sT0FBTyxHQUFQLENBQVcsOEJBQVg7QUFDQSxPQUFPLEdBQVAsQ0FBVyxpQkFBTyxNQUFQLEVBQVg7QUFDQSxPQUFPLE1BQVAsQ0FBYyxJQUFkIiwiZmlsZSI6InNlcnZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLb2EgZnJvbSAna29hJztcbmltcG9ydCByb3V0ZXIgZnJvbSAnLi4vcm91dGVyJztcbmltcG9ydCBib2R5UGFyc2VyIGZyb20gJ2tvYS1ib2R5cGFyc2VyJztcbmNvbnN0IHNlcnZlciA9IG5ldyBLb2EoKTtcbnNlcnZlci51c2UoYm9keVBhcnNlcigpKTtcbnNlcnZlci51c2Uocm91dGVyLnJvdXRlcygpKTtcbnNlcnZlci5saXN0ZW4oNDAwMCk7XG4iXX0=
