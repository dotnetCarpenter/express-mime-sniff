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

// shouldHandle :: Array a -> Boolean b
// const emptyArray = S.pipe ([
//   S.prop ('length'),
//   S.equals (0)
// ]);


const middleware = (root = '', options = {}) => (request, response, next) => {
  console.debug (
    request.path,
    // options.filter && S.flip (S.test) (request.path) (options.filter[0]),
    // options.filter && S.filter (S.flip (S.test) (request.path)) (options.filter),
    // options.filter && S.prop ('length') (S.filter (S.flip (S.test) (request.path)) (options.filter)),
    // options.filter && S.equals (0) (S.prop ('length') (S.filter (S.flip (S.test) (request.path)) (options.filter))),
  );

  if (options.filter) {
    // find_ :: String a -> Maybe b
    const find_ = S.pipe ([
      S.flip (S.test),
      S.flip (S.find) (options.filter),
    ]);

    console.debug (
     find_ (request.path),
     S.isNothing (find_ (request.path))
    );

    // const shouldIgnore = S.pipe ([
    //   S.filter (S.flip (S.test) (request.path)),
    //   emptyArray
    // ]);

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
