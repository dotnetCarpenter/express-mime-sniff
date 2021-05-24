import path        from 'path';
import S           from 'sanctuary';
import { sniffer } from './lib/sniffer.js';

const { pipe } = S;

// const trace = tag => x => (console.log (tag, x), x)

const setMimeType = response => mimeType => {
  if (response.headersSent) return;

  response.set ({
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff'
  });
};

const removeLeadingDot = s => s.replace (/^\./, '');
const getExtension= S.pipe ([
  path.extname,
  removeLeadingDot,
]);

const middleware = (root = '', options = {}) => (request, response, next) => {
  if (options.extensions && S.not (S.elem (getExtension (request.path)) (options.extensions))) {
    return next ();
  }

  const happyPath = pipe ([
    setMimeType (response),
    next,
  ]);

  const sadPath = pipe ([
     console.error,
     next,
  ]);

  sniffer
    (sadPath)
    (happyPath)
    (path.resolve (root, request.path.slice (1)));
};

export { middleware };
