import http           from 'http';
import express        from 'express';
import { middleware } from '../index.mjs';

const receiveData = (data = '') => chunk => {
  if (chunk != null) data += chunk;

  return data;
}

const ROOT = '.';
//const ROOT = 'spec/fixtures';
const PATH1 = 'http://localhost:8080/wrong/path.jpg';
const PATH2 = 'http://localhost:8080/spec/fixtures/fake.jpg';
const PATH3 = 'http://localhost:8080/fake.jpg';
const PATH4 = 'http://localhost:8080/spec/fixtures/ost.txt';

const request = path => {
  http.get (path, response => {
    const rawData = receiveData ()

    response.on ('data', rawData);
    response.on ('end', () => {
      const responseBody = rawData ();
      const length = Buffer.byteLength(responseBody);

      console.debug ('length:', length);
      console.debug ('headers', response.headers);
      if (length < 200) console.debug (responseBody);
    });

  }).on ('error', console.error);
};

const app = express ();
app.use (middleware (ROOT, { extensions: ['txt'] }));
app.use (express.static(ROOT));
app.listen (8080);

([PATH1, PATH2, PATH3, PATH4]).map (request);
