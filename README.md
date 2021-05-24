# express-mime-sniff


**express-mime-sniff** is an [express](http://expressjs.com/) middleware for
setting HTTP `Content-Type` headers for files by utilizing a *nix `file`
program available on your system.

This approach is independent of file extension, unlike the default logic used
by [`express.static`][express.static] and should therefore yield better results.

> **express-mime-sniff** should be considered **alpha** at this point.

**express-mime-sniff** uses [sanctuary][sanctuary], which by default does type
checking. To disable type checking, and gain performance, you must set
the enviroment variable: `NODE_ENV=production`.

# API

Version: `0.2.0`

- [middleware](#middleware)
  - [serving content from another directory](#serving-content-from-another-directory)
  - [options.filters](#optionsfilters)
- [sniffer](#sniffer)
  - [wrap sniffer in Promise](#wrap-sniffer-in-promise)
- [*nix file program](#nix-file-program)

-------------------------------------------------------------------------------

## middleware

The `middleware` will add `Content-Type` and `'X-Content-Type-Options': 'nosniff'`
HTTP headers to all requests if successful. If an error occur, `middleware` will
write to `stderr` and do nothing with the request but forward it to the next
middleware function.

Remember to use `middleware` before [`express.static`][express.static].

```js
import express        from 'express';
import { middleware } from '**express-mime-sniff**';

const app = express ();
app.use (middleware ()); // important to use middleware before express.static
app.use (express.static('.'));
app.listen (8080);
```

### serving content from another directory

If you configure [`express.static`][express.static] to serve content from
another directory than your current working directory, you need to tell the
`middleware`. That is done in the exact same way as with
[`express.static`][express.static].

```js
const ROOT_PATH = 'specify/the/root/directory/from/which/to/serve/static/assets';
const app = express ();

app.use (middleware (ROOT_PATH));
app.use (express.static (ROOT_PATH));
app.listen (8080);
```

### options.filters

+ `middleware (ROOT_PATH, { filters })` Add an array of regular expressions to
filter which files **express-mime-sniff** should handle. The RegExp will be
tested against [`request.path`](http://expressjs.com/en/4x/api.html#req.path).

```js
const ROOT_PATH = 'spec/fixtures/';
const OPTIONS = { filters: [/\.txt$/, /\.png$/] };

app = express ();
app.use (middleware (ROOT_PATH, OPTIONS));
app.use (express.static (ROOT_PATH));
app.listen (8080);
```

Or you can use the built-in
[path filter in express](http://expressjs.com/en/4x/api.html#app.use). Notice
that express requires that the RegExp matches the entire path to the file or
the wrong path will be sent to **express-mime-sniff**.

```js
const ROOT_PATH = 'spec/fixtures/';

app = express ();
app.use ([/.*\.txt$/, /.*\.png$/], middleware (ROOT_PATH));
app.use (express.static (ROOT_PATH));
app.listen (8080);
```

## sniffer

If you are unhappy with the `middleware` you can write your own, using `sniffer`.

> NOTE: `sanctuary` is not required but **express-mime-sniff** uses `sanctuary`,
> so it is included in the package, as a dependency.

```js
import S from 'sanctuary';
import { sniffer } from '**express-mime-sniff**';

/* @typedef sniffer
 * sniffer :: String Error, String MimeType, String Path => (Error -> void) -> (MimeType -> void) -> Path -> void
 * @param {{ (string: error):void }} errorHandler Function that will handle an error.
 * @param {{ (string: mimeType):void }} successHandler Function that will get mime-type for `path`.
 * @param {string} path Path to the file you want the mime-type for.
 * @returns {void}
 */

const test = sniffer
  (S.pipe ([console.error, () => process.exit(1)])) // error callback
  (console.log);                                    // success callback

// happy path
test ('spec/fixtures/fake.jpg'); // -> "image/png; charset=binary"

// sad path
test ('no-such-file.jpg');       // -> "ERROR: cannot stat `no-such-file.jpg' (No such file or directory)"
```

### wrap sniffer in Promise

```js
const promise = new Promise ((resolve, reject) => {
  sniffer (reject) (resolve) ('path/to/file');
});
```


## *nix file program

> Description: Recognize the type of data in a file using "magic" numbers
> The file command is "a file type guesser", a command-line tool that
> tells you in words what kind of data a file contains.

You can usually configure _magic mime-types_ in either `/etc/magic`,
`/etc/magic.mime` or add _magic_ files to `/usr/share/misc/magic/`.
More information with `man magic` or at https://www.darwinsys.com/file/.


[express.static]: http://expressjs.com/en/4x/api.html#express.static
[sanctuary]: https://sanctuary.js.org/
