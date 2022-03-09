// @ts-check

'use strict'

const { spawn } = require ('child_process')
const { ap, pipe, trim, ifElse, Left, Right, compose, bimap } = require ('sanctuary')

//const trace = tag => x => (console.log (tag, x), x)

// sliceAfterSpace :: String|Buffer -> String
const sliceAfterSpace = ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '))

// classifyResult :: Buffer -> Either (Left String, Right String)
const classifyResult = pipe ([
  // @ts-ignore
  sliceAfterSpace,
  String,
  trim,
  ifElse (s => s.indexOf ('ERROR') > -1) (Left) (Right),
])

// sniffer :: String Error, String MimeType, String Path => (Error -> void) -> (MimeType -> void) -> Path -> void
// sniffer :: (String -> Void) -> (String -> Void) -> String -> Void
const sniffer = errorHandler => successHandler => {
  const program = compose (bimap (errorHandler) (successHandler)) (classifyResult)

  return path => {
    const file = spawn ('file', ['--mime', '-E', path])
    file.stdout.on ('data', program)
  }
}

// test
//const test = sniffer
//  (pipe ([console.error, () => process.exit(1)]))
//  (console.log)
//test ('spec/fixtures/fake.jpg')  // happy path
//test ('no-such-file.jpg') // sad path

module.exports = sniffer
