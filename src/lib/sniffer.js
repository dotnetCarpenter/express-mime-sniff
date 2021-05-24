import { spawn } from 'child_process';
import S from 'sanctuary';
const { ap, pipe, trim, ifElse, Left, Right, compose, bimap } = S;

//const trace = tag => x => (console.log (tag, x), x)

// sliceAfterSpace :: String -> String
const sliceAfterSpace = ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '));

// program :: Buffer -> Either (Error, String)
const program = S.pipe ([
  sliceAfterSpace,
  String,
  trim,
  ifElse (s => s.indexOf ('ERROR') > -1) (Left) (Right),
]);

// sniffer :: String Error, String MimeType, String Path => (Error -> Void) -> (MimeType -> Void) -> Path -> Void
/**
 *
 * @param {{ (string: a):void }} errorHandler
 * @returns {{ () }}
 */
const sniffer = errorHandler => successHandler => path => {
  const file = spawn ('file', ['--mime', '-E', path]);

  file.stdout.on ('data', compose (bimap (errorHandler) (successHandler)) (program));
}

// test
//const test = sniffer
//  (pipe ([console.error, () => process.exit(1)]))
//  (console.log);
//test ('spec/fixtures/fake.jpg');  // happy path
//test ('no-such-file.jpg'); // sad path

export { sniffer };
