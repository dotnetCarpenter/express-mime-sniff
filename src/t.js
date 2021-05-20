import http           from 'http';
import express        from 'express';
import { middleware } from '../index.mjs';

const receiveData = (data = '') => chunk => {
  if (chunk != null) data += chunk;

  return data;
}
//const t = receiveData ()
//t ('hello')
//t (' ')
//t ('world')
//console.log(t ())

const PATH1 = 'http://localhost:8080/spec/fixtures/t-ssm.jpg';
const PATH2 = 'http://localhost:8080/spec/fixtures/fake.jpg';
const request = path => {
  http.get (path, response => {
    const rawData = receiveData ()

    response.on ('data', rawData);
    response.on ('end', () => {
//      console.log (rawData ())
      console.debug ('length:', rawData ().length);
      console.debug ('headers', response.headers);
    });

  }).on ('error', console.error);
};

const app = express ();
app.use (middleware);
app.use (express.static('.'));
app.listen (8080);

([PATH1, PATH2]).map (request);
