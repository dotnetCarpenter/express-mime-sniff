import { spawn } from 'child_process';
import S         from 'sanctuary';
//import Future    from 'fluture';

//const trace = tag => x => (console.log (tag, x), x)
const trigger = name => arg => observer.trigger (name, arg);
const sliceAfterSpace = S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '));
// program :: Buffer -> Either (Error, String)
const program = S.pipe ([
  sliceAfterSpace,
  String,
  S.trim,
  S.ifElse (s => s.indexOf ('ERROR') > -1) (S.Left) (S.Right),
]);

const sniffer = errorHandler => f => path => {
  const file = spawn ('file', ['--mime', '-E', path]);

  file.stdout.on ('data', S.pipe ([
    program,
    S.bimap (errorHandler) (f)
  ]));
}

// test
//const test = sniffer
//  (S.pipe ([console.error, () => process.exit(1)]))
//  (console.log);
//test ('spec/fixtures/fake.jpg');  // happy path
//test ('spec/fixtures/t-ssm.jpg'); // sad path

export { sniffer };
