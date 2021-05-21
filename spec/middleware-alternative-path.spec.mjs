import http           from 'http';
import express        from 'express';
import { middleware } from '../index.mjs';
import getContentType from './contentType.mjs';

const PORT = 8081;
const ROOT_PATH = 'spec/fixtures';

const request = getContentType (PORT);
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
    const actual   = request ('fake.jpg');

    return expectAsync (actual).toBeResolvedTo (expected);
  });

});
