import S           from 'sanctuary';
import { sniffer } from './lib/sniffer.js';

const setMimeType = response => mimeType => {
  if (response.headersSent) return;

  response.set ({
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff'
  });
};
const middleware = (request, response, next) => {
  const happyPath = S.pipe ([
    setMimeType (response),
    next,
  ]);

  const sadPath = S.pipe ([
     console.error,
     next,
  ]);

  sniffer
    (sadPath)
    (happyPath)
    (request.path.slice (1));
};

export { middleware };
