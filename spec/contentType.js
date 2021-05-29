const http = require ('http');

module.exports = port => path => new Promise ((resolve, reject) => {
  http.get (`http://localhost:${port}/${path}`, response => {
    resolve (response.headers['content-type']);
  }).on ('error', reject);
}).catch (console.error);
