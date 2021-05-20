import { spawn }    from 'child_process';
import S            from 'sanctuary';
import eventEmitter from './lib/eventEmitter.js';

const EVENT_NAME = 'mime';

const trace = tag => x => (console.log (tag, x), x)
const observer = eventEmitter (new Map);
const trigger = name => arg => observer.trigger (name, arg);
const sliceAfterSpace = S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '));
const errorCodeHandler = S.when (S.gt (0)) (trigger ('error'));
const unary = f => x => f (x)
const program = S.pipe ([
  String,
  sliceAfterSpace,
  S.trim,
//  trace ('after slice'),
  S.ifElse (s => s.indexOf ('ERROR') > -1) (trigger ('error')) (trigger (EVENT_NAME)),
]);

const sniffer = f => path => {
  const file = spawn ('file', ['--mime', '-E', path]);
//  let file
//  try {
//    file = spawn ('file', ['--mime', path]);
//  } catch (error) {
//    console.error ('did throw!');
//  }

  observer.on (EVENT_NAME, f);

//  file.on ('close', S.pipe ([x => x, (a,b,c) => { console.log ('a', a, 'b', b, 'c', c); }]));
//S.pipe ([
////    S.identity,
//    trace ('close pipe'),
//    errorCodeHandler,
//  ]));

//  file.stderr.on ('data', trigger ('error'));

  file.stdout.on ('data', program);
//  file.stdout.on ('data', unary (program));
}

const middleware = (request, response, next) => {
  console.warn (request.path);
  next ()
};

// test
sniffer (console.log) ('/specs/fixtures/t-ssm.jpg');

export { sniffer, middleware };
