import { spawn }    from 'child_process';
import eventEmitter from './eventEmitter.js';

// const sniffer = file => 

const observer = eventEmitter (new Map)
const file = spawn('file', ['-i', './tests/fixtures/t-ssm.jpg']);

file.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

file.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

file.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});


