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

export class UnknownError extends HTTPError {
  constructor (err) {
    super(err)
    this.message = 'an unknown error occurred'
  }
}

export class UnimplementedError extends HTTPError {
  constructor (err) {
    super(err)
    this.statusCode = 501
    this.message = 'this operation is not implemented'
  }
}

export class BadRequestError extends HTTPError {
  constructor (err, paramDescription) {
    super(err)
    this.statusCode = 400
    this.message = 'invalid parameters were passed'
    this.badParameters = paramDescription
  }
}

export class ForbiddenError extends HTTPError {
  constructor (err, message) {
    super(err)
    this.statusCode = 403
    this.message = message
  }
}

export class ConflictError extends HTTPError {
  constructor (err, message, paramDescription) {
    super(err)
    this.statusCode = 409
    this.message = message
    this.badParameters = paramDescription
  }
}

export class UnauthorizedError extends HTTPError {
  constructor (err) {
    super(err)
    this.statusCode = 401
    this.message = 'you are not authenticated to perform this operation'
  }
}

export class NotFoundError extends HTTPError {
  constructor (err) {
    super(err)
    this.statusCode = 404
    this.message = 'resource not found'
  }
}

export default {
  formatError,
  HTTPError,
  UnknownError,
  UnimplementedError,
  BadRequestError,
  ForbiddenError,
  ConflictError,
  UnauthorizedError,
  NotFoundError
}
