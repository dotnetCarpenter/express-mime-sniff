'use strict'
// TODO: perhaps execFile() is more efficient than spawn
// https://devdocs.io/node/child_process#child_process.execFile()
const { spawn } = require ('child_process')
const { ap, pipe, trim, ifElse, Left, Right, compose, bimap } = require ('sanctuary')

//const trace = tag => x => (console.log (tag, x), x)

// sliceAfterSpace :: String|Buffer -> String
const sliceAfterSpace = ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '))

// program :: Buffer -> Either (Left String, Right String)
const program = pipe ([
  // @ts-ignore
  sliceAfterSpace,
  String,
  trim,
  ifElse (s => s.indexOf ('ERROR') > -1) (Left) (Right),
])

// sniffer :: String Error, String MimeType, String Path => (Error -> void) -> (MimeType -> void) -> Path -> void
const sniffer = errorHandler => successHandler => path => {
  const file = spawn ('file', ['--mime', '-E', path])

  file.stdout.on ('data', compose (bimap (errorHandler) (successHandler)) (program))
}

// test
//const test = sniffer
//  (pipe ([console.error, () => process.exit(1)]))
//  (console.log)
//test ('spec/fixtures/fake.jpg')  // happy path
//test ('no-such-file.jpg') // sad path

module.exports = sniffer
