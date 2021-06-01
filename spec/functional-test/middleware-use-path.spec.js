'use strict'

const express = require ('express')
const { middleware } = require ('../..')
const getContentType = require ('../utils/contentType.js')


const ROOT_PATH = 'spec/fixtures/'

describe ('middleware', () => {
  let app, request

  beforeAll (() => {
    app = express ()
    app.use ([/.*\.txt$/, /.*\.png$/], middleware (ROOT_PATH))
    app.use (express.static (ROOT_PATH))

    const server = app.listen (0)
    request = getContentType (server.address().port)
  })

  it ('should be configured to only handle .txt files', () => {
    // fake.jpg is an png file but express.static thinks it's an jpeg'
    const urls = ['ascii.txt', 'ost.txt', 'fake.jpg']
    const expected = ['text/plain; charset=us-ascii', 'text/plain; charset=utf-8', 'image/jpeg']

    return expectAsync (Promise.all (urls.map (request))).toBeResolvedTo (expected)
  })

})
