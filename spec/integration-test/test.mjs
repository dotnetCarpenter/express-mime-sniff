import express        from 'express';
import { middleware } from '../../index.mjs';
import getContentType from '../contentType.js';


const PORT = 8079;
const request = getContentType (PORT);

let app;

beforeAll (() => {
  app = express ();
  app.use (middleware ());
  app.use (express.static ('.'));
  app.listen (PORT);
});


describe ('express-mime-sniff used from a EcmaScript Module', () => {

  it ('should handle an HTTP request', () => {
    const expected = 'image/png; charset=binary';
    const actual   = request (`spec/fixtures/fake.jpg`);

    return expectAsync (actual).toBeResolvedTo (expected)
  });

});
