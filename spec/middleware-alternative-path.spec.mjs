import http           from 'http';
import express        from 'express';
import { middleware } from '../index.mjs';

const PORT = 8081;
const ROOT_PATH = 'spec/fixtures';
let app;

beforeAll (() => {
  app = express ();
  app.use (middleware (ROOT_PATH));
  app.use (express.static (ROOT_PATH));
  app.listen (PORT);
});

describe ('middleware with relative static path', () => {

  it ('should handle an HTTP request', () => {
    const expected = 'image/png; charset=binary';
    const actual   = new Promise ((resolve, reject) => {
      http.get (`http://localhost:${PORT}/fake.jpg`, response => {
        resolve (response.headers['content-type']);
      }).on ('error', reject);
    });

    return expectAsync (actual).toBeResolvedTo (expected);
  });

});
