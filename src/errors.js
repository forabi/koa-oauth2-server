export const OAUTH2_ERROR = Symbol('OAuth2 Error');

export class GenericError extends Error {
  name = 'invalid_request';
  statusCode = 400;
  type = OAUTH2_ERROR;
  toJSON({ state }) {
    return {
      error: this.name,
      error_description: this.message,
      state,
    };
  }
}

export class MissingInputError extends GenericError {
  constructor(input, ...args) {
    super(...args);
    this.input = input;
    this.message = `The required parameter ${this.input} is missing.`;
  }
}

export class InvalidInputError extends GenericError {
  name = 'Invalid Input';
  constructor(param, actual, expected, ...args) {
    super(...args);
    if (!actual || !expected) {
      this.message = `Invalid input for "${param}"`;
    } else {
      this.message = `The value "${actual}" for parameter "${param}" is \
invalid and must be ${
        typeof expected === 'string' ?
          `"${expected}"`
            : `one of ${ expected.map(s => `"${s}"`).join(', ') }`
      }`;
    }
  }
}

export class InvalidGrantTypeError extends InvalidInputError {
  constructor(actual, expected, ...args) {
    super('grant_type', actual, expected, ...args);
  }
}
export class InvalidResponseTypeError extends InvalidInputError {
  constructor(actual, expected, ...args) {
    super('response_type', actual, expected, ...args);
  }
}

export class InvalidCredentialsError extends InvalidInputError {
  name = 'Invalid Credentials';
  message = 'Invalid values for "password" or "username"';
}

export function toOAuthError(error, state) {
  if (error.type === Object(OAUTH2_ERROR)) {
    return error.toJSON();
  }
  return new GenericError(error.message).toJSON({ state });
}
