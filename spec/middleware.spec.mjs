import http           from 'http';
import express        from 'express';
import { middleware } from '../index.mjs';

const PORT = 8080;
let app;

beforeAll (() => {
  app = express ();
  app.use (middleware);
  app.use (express.static('.'));
  app.listen (PORT);
});

describe ('middleware', () => {

  it ('should handle an HTTP request', () => {
    const expected = 'image/png; charset=binary';
    const actual   = new Promise ((resolve, reject) => {
      http.get (`http://localhost:${PORT}/spec/fixtures/fake.jpg`, response => {
        resolve (response.headers['content-type']);
      }).on ('error', reject);
    });

    return expectAsync (actual).toBeResolvedTo (expected);
  });

  it ('should not handle 404 requests', () => {
//    const 
  });

});
