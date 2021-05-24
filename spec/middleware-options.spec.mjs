import express        from 'express';
import { middleware } from '../index.mjs';
import getContentType from './contentType.mjs';


const PORT = 8082;
const ROOT_PATH = 'spec/fixtures/';
const OPTIONS = { filter: [/\.txt$/, /\.png$/] };

const request = getContentType (PORT);

let app;

beforeAll (() => {
  app = express ();
  app.use (middleware (ROOT_PATH, OPTIONS));
  app.use (express.static (ROOT_PATH));
  app.listen (PORT);
});

describe ('middleware', () => {

  it ('should be configured to only handle .txt files', () => {
    // fake.jpg is an png file but express.static thinks it's an jpeg'
    const urls = ['ascii.txt', 'ost.txt', 'fake.jpg'];
    const expected = ['text/plain; charset=us-ascii', 'text/plain; charset=utf-8', 'image/jpeg'];

    return expectAsync (Promise.all (urls.map (request))).toBeResolvedTo (expected);
  });

});
