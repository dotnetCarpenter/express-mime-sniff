import path from 'path';
import express from 'express';
import { sniffer, middleware } from '../index.mjs';

const app = express ();

const trace = tag => x => (console.log (tag, x), x)

sniffer (trace ('mime-type:')) ('specs/fixtures/t-ssm.jpg');

/*app.use (
sniffer
  ()
  ('./specs/fixtures/t-ssm.jpg')
*/
