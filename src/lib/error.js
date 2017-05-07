const statusCodeMap = {
  400: 'invalid_parameter',
  401: 'action_unauthorized',
  403: 'action_forbidden',
  404: 'not_found',
  409: 'state_conflict',
  500: 'internal_error',
  501: 'internal_error',
  502: 'internal_error'
}

export function formatError (err) {
  return {
    reason: statusCodeMap[err.statusCode],
    message: err.userMessage,
    parameters: err.badParameters
  }
}

export class HTTPError extends Error {
  constructor (err) {
    super()
    this.origin = err
    this.statusCode = 500
  }
}

/* This is identical to HTTPError, but semantically different */
export class UnknownError extends HTTPError {}

export class UnimplementedError extends HTTPError {
  constructor () {
    super()
    this.statusCode = 501
  }
}
export default {
  formatError,
  HTTPError,
  UnknownError,
  UnimplementedError,
}
