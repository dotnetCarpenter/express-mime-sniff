import path        from 'path';
import S           from 'sanctuary';
import { sniffer } from './lib/sniffer.js';

const { pipe } = S;

// const trace = tag => x => (console.log (tag, x), x)

/**
 * Set "Content-Type": `mimeType` on a `response`.
 * @param {import ('express').Response} response
 * @returns {{ (mimeType:string):void }}
 */
const setMimeType = response => mimeType => {
  if (response.headersSent) return;

  response.header ({
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff'
  });
};

const middleware = (root = '', options = {}) => (request, response, next) => {
  // console.debug (
  //   'path', request.path,
  //   'baseUrl', request.baseUrl,
  //   'mountpath', request.app.mountpath,
  //   'root', root,
  //   path.resolve (root, (request.baseUrl || request.path).slice (1))
  // )

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
    (path.resolve (root, (request.baseUrl || request.path).slice (1)));
};

export { middleware };
