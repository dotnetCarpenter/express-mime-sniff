const express = require ('express');
const { middleware } = require ('..');
const getContentType = require ('./contentType.js');

const PORT = 8084;

const request = getContentType (PORT);
let app;

beforeAll (() => {
  app = express ();
  app.use (middleware ('spec/fixtures'));
  app.use (express.static ('spec/fixtures'));
  app.use (middleware ('spec/fixtures/subdir'));
  app.use (express.static ('spec/fixtures/subdir'));
  app.listen (PORT);
});

describe ('multiple middleware with relative static paths', () => {

  it ('should handle an HTTP request to spec/fixtures', () => {
    const expected = 'image/png; charset=binary';
    const actual   = request ('fake.jpg');

    return expectAsync (actual).toBeResolvedTo (expected);
  });

  it ('should handle an HTTP request to spec/fixtures/subdir', () => {
    const expected = 'image/png; charset=binary';
    const actual   = request ('fake2.jpg');

    actual.catch (console.error);

    return expectAsync (actual).toBeResolvedTo (expected);
  });

});
