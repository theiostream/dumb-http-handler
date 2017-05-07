import R from 'ramda'
import Promise from 'bluebird'

import errorLib from './error'
import unimplementedController from './unimplemented-controller'

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

    const handlerOptions = R.omit(['controller'], options)
    handlerOptions.url = req.url

    return Promise.resolve()
      .then(() => handler(parameters, handlerOptions))
      .then((response) => { res.json(response) })
      .catch((err) => {
        if (controller.errored) {
          controller.errored(err)
        }

        if (!(err instanceof error.HTTPError)) {
          res.status(500).json({
            error: error.formatError(new error.UnknownError())
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

export default {
  error: errorLib,
  createHandler,
  createGetHandler,
  createPostHandler,
  createPutHandler,
  createPatchHandler,
  createDeleteHandler
}
