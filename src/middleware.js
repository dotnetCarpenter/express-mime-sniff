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

const middleware = (root = '', options = {}) => (request, response, next) => {
  if (options.filters) {
    // find_ :: String a -> Maybe b
    const find_ = S.pipe ([
      S.flip (S.test),
      S.flip (S.find) (options.filters),
    ]);

    if (S.isNothing (find_ (request.path))) {
      return next ();
    }
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
