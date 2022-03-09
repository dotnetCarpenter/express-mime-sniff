'use strict'

const path    = require ('path')
const {
  compose,
  find,
  flip,
  I,
  isNothing,
  K,
  pipe,
  test,
}             = require ('sanctuary')
const sniffer = require ('./lib/sniffer.js')

const trace = log => x => (log (x), x)

const setMimeType = response => mimeType => {
  if (response.headersSent) return

  response.header ({
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff'
  })
}

const setupSadPath = (silent, fallthrough = true) => pipe ([
  silent ? I : trace (console.error),
  fallthrough ? _=>{} : I,
])

const setupOptions = (options) => ({
  // filters :: String -> Boolean
  filters: options.filters
    ? pipe ([flip (test), flip (find) (options.filters), isNothing])
    : K (false),
  sadPath: setupSadPath (options.silent, options.fallthrough)
})

const middleware = (root = '', options = {}) => {
  const { filters, sadPath } = setupOptions (options)

  return (request, response, next) => {
    // console.debug (
    //   'path', request.path,
    //   'baseUrl', request.baseUrl,
    //   'mountpath', request.app.mountpath,
    //   'root', root,
    //   path.resolve (root, (request.baseUrl || request.path).slice (1))
    // )

    if (filters (request.path)) return next ()

    const happyPath = pipe ([
      setMimeType (response),
      next,
    ])

    sniffer
      (compose (next) (sadPath))
      (happyPath)
      (path.resolve (root, (request.baseUrl || request.path).slice (1)))
  }
}

module.exports = middleware
