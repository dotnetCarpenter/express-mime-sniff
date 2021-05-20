# express-mime-sniff

-------------------------------------------------------------------------------

express-mime-sniff is a package for setting HTTP `Content-Type` headers for
files by utilizing a *nix `file` program available on your system.

This approach is independent of file extension, unlike the default logic used
by [`express.static`][express] and should therefore yield better results.

> Package status should be considered **alpha** at this point.

# API

## middleware

The `middleware` will add `Content-Type` and `'X-Content-Type-Options': 'nosniff'`
HTTP headers to all requests if successful. If an error occur, `middleware` will
write to `stderr` and do nothing with the request but forward it to the next
middleware function.

Remember to use middleware before [`express.static`][express].

```js
import express        from 'express';
import { middleware } from 'express-mime-sniff';

const PORT = 8080;
const app = express ();
app.use (middleware); // important to use middleware before express.static
app.use (express.static('.'));
app.listen (PORT);
```


## sniffer

If you are unhappy with the `middleware` you can write your own, using `sniffer`.

> NOTE:`sanctuary` is not required but _express-mime-sniff_ uses `sanctuary`,
> so it is included, as a dependency, in the package.

```js
import S from 'sanctuary';
import { sniffer } from 'express-mime-sniff';

// sniffer :: String Error, String MimeType, String Path => (Error -> Void) -> (MimeType -> Void) -> Path -> Void
/* @typedef sniffer
 * @param {{ (String: a):Void }} errorHandler Function that will handle an error.
 * @param {{ (String: b):Void }} successHandler Function that will get mime-type for `path`.
 * @param {String} path Path to the file you want the mime-type for.
 * @returns {Void}
 */

const test = sniffer
  (S.pipe ([console.error, () => process.exit(1)])) // error callback
  (console.log);                                    // success callback

// happy path
test ('spec/fixtures/fake.jpg'); // -> "image/png; charset=binary"
// sad path
test ('no-such-file.jpg');       // -> "ERROR: cannot stat `no-such-file.jpg' (No such file or directory)"
```

### Wrap sniffer in Promise

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
More information with `man magic`.

[express]: http://expressjs.com/en/4x/api.html#express.static
