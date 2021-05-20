import { spawn } from 'child_process';
import S         from 'sanctuary';

//const trace = tag => x => (console.log (tag, x), x)

// sliceAfterSpace :: String -> String
const sliceAfterSpace = S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '));

// program :: Buffer -> Either (Error, String)
const program = S.pipe ([
  sliceAfterSpace,
  String,
  S.trim,
  S.ifElse (s => s.indexOf ('ERROR') > -1) (S.Left) (S.Right),
]);

// sniffer :: Function f => f -> f -> String -> Void
const sniffer = errorHandler => f => path => {
  const file = spawn ('file', ['--mime', '-E', path]);

  file.stdout.on ('data', S.compose (S.bimap (errorHandler) (f)) (program));
}

// test
//const test = sniffer
//  (S.pipe ([console.error, () => process.exit(1)]))
//  (console.log);
//test ('spec/fixtures/fake.jpg');  // happy path
//test ('no-such-file.jpg'); // sad path

export { sniffer };
