# express-mime-sniff


**express-mime-sniff** is an [express](http://expressjs.com/) middleware for
setting HTTP `Content-Type` headers for files by utilizing a *nix `file`
program available on your system. **express-mime-sniff** is meant to be used
together and before [`express.static`][express.static].

This approach is independent of file extension, unlike the default logic used
by [`express.static`][express.static] and should therefore yield better results.

```
$ npm install express-mime-sniff --production --save
```

> **express-mime-sniff** should be considered **alpha** at this point.

**express-mime-sniff** uses [sanctuary][sanctuary], which by default does type
checking. To disable type checking, and gain performance, you must set
the environment variable: `NODE_ENV=production`.


# API

Version: `0.4.0`

- [middleware](#middleware)
  - [serving content from another directory](#serving-content-from-another-directory)
  - [options.filters](#optionsfilters)
  - [options.fallthrough](#optionsfallthrough)
  - [options.silent](#optionssilent)
- [sniffer](#sniffer)
  - [wrap sniffer in Promise](#wrap-sniffer-in-promise)
- [*nix file program](#nix-file-program)

-------------------------------------------------------------------------------

## middleware

The `middleware` will add `Content-Type` and `'X-Content-Type-Options': 'nosniff'`
HTTP headers to all requests if successful. If an error occur, `middleware` will
write to `stderr` and do nothing with the request but forward it to the next
middleware function. If HTTP-headers are already sent to the client in a
previous middleware function, **express-mime-sniff** will do nothing but burn
CPU cycles.

Remember to use `middleware` before [`express.static`][express.static].

```js
import express        from 'express'
import { middleware } from 'express-mime-sniff'

const app = express ()
app.use (middleware ()) // important to use middleware before express.static
app.use (express.static('.'))
app.listen (8080)
```

### serving content from another directory

If you configure [`express.static`][express.static] to serve content from
another directory than your current working directory, you need to tell the
`middleware`. That is done in the exact same way as with
[`express.static`][express.static].

```js
const ROOT_PATH = 'specify/the/root/directory/from/which/to/serve/static/assets'
const app = express ()

app.use (middleware (ROOT_PATH))
app.use (express.static (ROOT_PATH))
app.listen (8080)
```

### options.filters

```js
middleware (ROOT_PATH, { filters })
```

Add an array of regular expressions to
filter which files **express-mime-sniff** should handle. The RegExp will be
tested against [`request.path`](http://expressjs.com/en/4x/api.html#req.path).

```js
const ROOT_PATH = 'spec/fixtures/'
const OPTIONS = { filters: [/\.txt$/, /\.png$/] }

app = express ()
app.use (middleware (ROOT_PATH, OPTIONS))
app.use (express.static (ROOT_PATH))
app.listen (8080)
```

Or you can use the built-in
[path filter in express](http://expressjs.com/en/4x/api.html#app.use). Notice
that express requires that the RegExp matches the entire path to the file or
the wrong path will be sent to **express-mime-sniff**.

```js
const ROOT_PATH = 'spec/fixtures/'

app = express ()
app.use ([/.*\.txt$/, /.*\.png$/], middleware (ROOT_PATH))
app.use (express.static (ROOT_PATH))
app.listen (8080)
```


### options.fallthrough

```js
middleware (ROOT_PATH, { fallthrough: false })
```

The default value is `true`.

The `fallthrough` option is modeled after serve-static's `fallthrough` option,
and tells the middleware to forward any error to express (like file not found),
if it is set to `false`.

_From the serve-static documentation:_
> Set the middleware to have client errors fall-through as just unhandled
> requests, otherwise forward a client error. The difference is that client
> errors like a bad request or a request to a non-existent file will cause
> this middleware to simply `next()` to your next middleware when this value
> is `true`. When this value is `false`, these errors (even 404s), will invoke
> `next(err)`.
>
> Typically `true` is desired such that multiple physical directories can be
mapped to the same web address or for routes to fill in non-existent files.
>
> The value `false` can be used if this middleware is mounted at a path that
> is designed to be strictly a single file system directory, which allows for
> short-circuiting 404s for less overhead. This middleware will also reply to
> all methods.


### options.silent

```js
middleware (ROOT_PATH, { silent: true })
```

The `silence` option will stop middleware from printing to stderr on error.

If `silence` is set to `true` and `fallthough` is set to `false`, then express
will print the error to stderr, cancelling out the effect. But still useful,
since you would else get the error message printed twice.

## sniffer

If you are unhappy with the `middleware` you can write your own, using `sniffer`.

> NOTE: `sanctuary` is not required but **express-mime-sniff** uses `sanctuary`,
> so it is included in the package, as a dependency.

```js
import S from 'sanctuary'
import { sniffer } from 'express-mime-sniff'

/* @typedef sniffer
 * sniffer :: String Error, String MimeType, String Path => (Error -> void) -> (MimeType -> void) -> Path -> void
 * @param {{ (string: error):any }} errorHandler Function that will handle an error.
 * @param {{ (string: mimeType):any }} successHandler Function that will get mime-type for `path`.
 * @param {string} path Path to the file you want the mime-type for.
 * @returns {void}
 */

const test = sniffer
  (S.pipe ([console.error, () => process.exit(1)])) // error callback
  (console.log)                                     // success callback

// happy path
test ('spec/fixtures/fake.jpg') // -> "image/png charset=binary"

// sad path
test ('no-such-file.jpg')       // -> "ERROR: cannot stat `no-such-file.jpg' (No such file or directory)"
```

### wrap sniffer in Promise

```js
const promise = new Promise ((resolve, reject) => {
  sniffer (reject) (resolve) ('path/to/file')
})
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
