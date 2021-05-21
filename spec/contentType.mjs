import http from 'http';

export default port => path => new Promise ((resolve, reject) => {
  http.get (`http://localhost:${port}/${path}`, response => {
    resolve (response.headers['content-type']);
  }).on ('error', reject);
}).catch (console.error);
