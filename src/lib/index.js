import * as R from 'ramda'
import * as Promise from 'bluebird'

import * as errorLib from './error'
import * as unimplementedController from './unimplemented-controller'

export const error = errorLib

export function createHandler (options) {
  const controller = options.controller ? options.controller : unimplementedController

  let handler = controller[options.method]
  if (!handler) {
    handler = unimplementedController[options.method]
  }

  return (req, res) => {
    // Mimic logic from req.param()
    const parameters = R.mergeAll(
      req.query,
      req.body,
      req.params
    )

    const handlerOptions = R.reject(R.prop('controller'), options)

    return Promise.resolve(handler(parameters, handlerOptions))
      .then((response) => { res.json(response) })
      .catch((err) => {
        if (!(err instanceof error.HTTPError)) {
          res.status(500).json({
            error: error.formatError(error.UnknownError())
          })
        }

        res.status(err.statusCode).json({
          error: error.formatError(err)
        })
      })
  }
}

export function createGetHandler (options) {
  return createHandler(R.merge(options, {
    method: 'GET'
  }))
}

export function createPostHandler (options) {
  return createHandler(R.merge(options, {
    method: 'POST'
  }))
}

export function createPutHandler (options) {
  return createHandler(R.merge(options, {
    method: 'PUT'
  }))
}

export function createPatchHandler (options) {
  return createHandler(R.merge(options, {
    method: 'PATCH'
  }))
}

export function createDeleteHandler (options) {
  return createHandler(R.merge(options, {
    method: 'DELETE'
  }))
}