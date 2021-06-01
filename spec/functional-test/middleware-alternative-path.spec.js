'use strict'

const express = require ('express')
const { middleware } = require ('../..')
const getContentType = require ('../utils/contentType.js')

const ROOT_PATH = 'spec/fixtures'

describe ('middleware with relative static path', () => {

  let app, request

  beforeAll (() => {
    app = express ()
    app.use (middleware (ROOT_PATH))
    app.use (express.static (ROOT_PATH))

    const server = app.listen (0)
    request = getContentType (server.address().port)
  })

  it ('should handle an HTTP request', () => {
    const expected = 'image/png; charset=binary'
    const actual   = request ('fake.jpg')

    return expectAsync (actual).toBeResolvedTo (expected)
  })

})
