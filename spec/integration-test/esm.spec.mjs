import express        from 'express'
import { middleware } from '../../index.mjs'
import getContentType from '../utils/contentType.js'


describe ('express-mime-sniff used from a EcmaScript Module', () => {
  let request

  beforeAll (() => {
    const app = express ()
    app.use (middleware ())
    app.use (express.static ('.'))

    const server = app.listen (0)
    request = getContentType (server.address().port)
  })

  it ('should handle an HTTP request', () => {
    const expected = 'image/png; charset=binary'
    const actual   = request (`spec/fixtures/fake.jpg`)

    return expectAsync (actual).toBeResolvedTo (expected)
  })

})
