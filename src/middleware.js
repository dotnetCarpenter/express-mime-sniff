import path        from 'path';
import S           from 'sanctuary';
import { sniffer } from './lib/sniffer.js';

const { pipe } = S;

const trace = tag => x => (console.log (tag, x), x)

const setMimeType = response => mimeType => {
  if (response.headersSent) return;

  response.set ({
    'Content-Type': mimeType,
    'X-Content-Type-Options': 'nosniff'
  });
};

const extname = p => path.extname (p);
const removeLeadingDot = s => s.replace (/^\./, '');
const getExtension= S.pipe ([
  path.extname,
//  extname,
  removeLeadingDot,
]);

const hasExtension = extensions => pext => extensions.some (ext => ext === pext)

const middleware = (root = '', options = {}) => (request, response, next) => {
  if (options.extensions && !hasExtension (options.extensions) (getExtension (request.path))) {
    next ();
//    console.debug (options.extensions, getExtension (request.path));
//    console.debug (hasExtension (options.extensions) (getExtension (request.path)));
  }
//  if (options.extensions && !options.extensions.every ((pext => ext => pext === ext) (getExtension (request.path)))) next ();

//    S.foldMap
//      (Boolean)
//      (S.equals (getExtension (request.path)))
//      (options.extensions)

//    S.foldMap (Boolean) (S.pipe ([
//      removeLeadingDot,
//      (pathExt => ext => ext === pathExt) (getExtension (request.path)),
//    ])) (options.extensions)
//    options.extensions.reduce (S.pipe ([removeLeadingDot, pathExt => ext => ext === pathExt]), getExtension (request.path))
//    S.reduce (reqExt => ext => ext === true ? true : reqExt === ext) (getExtensionFromPath (request.path)) (options.extensions)

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
