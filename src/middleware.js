const path = require ('path');
const { pipe, flip, test, find, isNothing } = require ('sanctuary');
const sniffer = require ('./lib/sniffer.js');

// const trace = tag => x => (console.log (tag, x), x)

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
    const find_ = pipe ([
      flip (test),
      flip (find) (options.filters),
    ]);

    if (isNothing (find_ (request.path))) {
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

module.exports = middleware;
