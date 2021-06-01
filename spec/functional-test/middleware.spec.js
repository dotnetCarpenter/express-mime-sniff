'use strict'

const express = require ('express')
const { middleware } = require ('../..')
const getContentType = require ('../utils/contentType.js')


describe ('middleware', () => {
  let app, request

  beforeAll (() => {
    app = express ()
    app.use (middleware ())
    app.use (express.static ('.'))

    const server = app.listen (0)
    request = getContentType (server.address().port)
  })

  it ('should handle an HTTP request', () => {
    const expected = 'image/png; charset=binary'
    const actual   = request ('spec/fixtures/fake.jpg')

    return expectAsync (actual).toBeResolvedTo (expected)
  })

  it ('should handle multiple HTTP requests', () => {
    const urls = ['spec/fixtures/fake.jpg', 'spec/fixtures/png.png', 'spec/fixtures/small_png.png'];
    const expected = ['image/png; charset=binary', 'image/png; charset=binary', 'image/png; charset=binary'];

    return expectAsync (Promise.all (urls.map (request))).toBeResolvedTo (expected)
  })

})
