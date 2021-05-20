import { spawn }    from 'child_process';
import S            from 'sanctuary';
import eventEmitter from './lib/eventEmitter.js';

const EVENT_NAME = 'mime';
const ERROR_EVENT_NAME = 'error';

const trace = tag => x => (console.log (tag, x), x)
const observer = eventEmitter (new Map);
const trigger = name => arg => observer.trigger (name, arg);
const sliceAfterSpace = S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '));
const program = S.pipe ([
  String,
  sliceAfterSpace,
  S.trim,
  S.ifElse (s => s.indexOf ('ERROR') > -1) (trigger (ERROR_EVENT_NAME)) (trigger (EVENT_NAME)),
]);

const sniffer = errorHandler => f => path => {
  const file = spawn ('file', ['--mime', '-E', path]);

  observer.on (EVENT_NAME, f);
  observer.on (ERROR_EVENT_NAME, errorHandler);

  file.stdout.on ('data', program);
}

const middleware = (request, response, next) => {
  console.warn (request.path);
  next ()
};

// test
//sniffer
//  (S.pipe ([console.error, () => process.exit(1)]))
//  (console.log)
//  ('spec/fixtures/t-ssm.jpg');

export { sniffer, middleware };
