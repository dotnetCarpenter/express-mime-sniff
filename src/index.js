import { spawn }    from 'child_process';
import S            from 'sanctuary';
import eventEmitter from './lib/eventEmitter.js';

const EVENT_NAME = 'mime';

// const trace = tag => x => (console.log (tag, x), x)
const sliceAfterSpace = S.pipe ([
  String,
  S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' ')),
  S.trim,
]);

const observer = eventEmitter (new Map);
const trigger = name => arg => observer.trigger (name, arg);

const sniffer = f => path => {
  const file = spawn ('file', ['--mime', path]);

  observer.on (EVENT_NAME, f);

  file.stderr.on ('data', trigger ('error'));

  file.stdout.on ('data', S.pipe ([
    sliceAfterSpace,
    trigger (EVENT_NAME),
  ]));
}

const middleware = (request, response, next) => {
  console.warn (request.path);
  next ()
};

// test
//sniffer (console.log) ('./specs/fixtures/t-ssm.jpg');

export { sniffer, middleware };
