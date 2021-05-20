import express from 'express';
import { sniffer, middleware } from '../index.mjs';

const app = express ();

//const trace = tag => x => (console.log (tag, x), x)

describe ('sniffer', () => {

  it ('should detect correct png mime-type for .jpg extension', () => {
    const expected = 'image/png; charset=binary';
    const actual   = new Promise ((resolve, reject) => {
      sniffer (reject) (resolve) ('spec/fixtures/t-ssm.jpg');
    });

    return expectAsync (actual).toBeResolvedTo (expected);
  });

  it ('should only trigger "error" when given wrong path', () => {
    const wrongPath = '/nothing.gif';
    const expected  = `cannot open \`${wrongPath}' (No such file or directory)`;
    const actual    = new Promise ((resolve, reject) => {
      sniffer (reject) (resolve) (wrongPath);
    });

    return expectAsync (actual).toBeResolvedTo (expected);
  });

});


//app.use (middleware)

