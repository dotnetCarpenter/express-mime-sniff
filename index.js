import { spawn }    from 'child_process';
import S            from 'sanctuary';
import eventEmitter from './eventEmitter.js';

// const trace = tag => x => (console.log (tag, x), x)
const sliceAfterSpace = S.ap (s => n => s.slice (n + 1)) (s => s.indexOf (' '));

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
const getMimeType = sniffer ('./tests/fixtures/t-ssm.jpg');
getMimeType.on ('mime', S.compose (console.log) (String));
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
