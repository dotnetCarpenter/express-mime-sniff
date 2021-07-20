'use strict'

const express = require ('express')
const { middleware } = require ('../..')
const getContentType = require ('../utils/contentType.js')


const OPTIONS = { silent: true }

describe ('multiple middleware with relative static paths', () => {

  let app, request
  beforeAll (() => {
    app = express ()
    app.use (middleware ('spec/fixtures', OPTIONS))
    app.use (express.static ('spec/fixtures'))
    app.use (middleware ('spec/fixtures/subdir', OPTIONS))
    app.use (express.static ('spec/fixtures/subdir'))

    const server = app.listen (0)
    request = getContentType (server.address().port)
  })

  it ('should handle an HTTP request to spec/fixtures', () => {
    const expected = 'image/png; charset=binary'
    const actual   = request ('fake.jpg')

    return expectAsync (actual).toBeResolvedTo (expected)
  })

  it ('should handle an HTTP request to spec/fixtures/subdir', () => {
    const expected = 'image/png; charset=binary'
    const actual   = request ('fake2.jpg')

    return expectAsync (actual).toBeResolvedTo (expected)
  })

})
