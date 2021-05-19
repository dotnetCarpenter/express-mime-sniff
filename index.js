import { spawn }    from 'child_process';
import S            from 'sanctuary';
import eventEmitter from './eventEmitter.js';

// const trace = tag => x => (console.log (tag, x), x)
const sliceAfterSpace = S.pipe ([
  String,
  S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' ')),
  S.trim,
]);

const sniffer = path => ({
  ...eventEmitter (new Map),

  mimeType () {
    const file = spawn('file', ['--mime', path]);
    const trigger = name => args => this.trigger (name, args);

    file.stdout.on ('data', S.pipe ([
      sliceAfterSpace,
      trigger ('mime'),
    ]));
  },
})


// test
// FIXME: this API sucks! We do not want to set `on` manually but rather as a second argument
const charCode = char => char.charCodeAt (0)
const toArrayBuffer = buffer => buffer.buffer
const getMimeType = sniffer ('./tests/fixtures/t-ssm.jpg');
getMimeType.on ('mime', console.log);
getMimeType.mimeType ();

/*
file.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

file.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

file.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

*/
