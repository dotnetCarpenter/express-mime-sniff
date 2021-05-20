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

```js
// sniffer :: Function f => f -> f -> String -> Void
/* [insert typescript interface here]
 */
const test = sniffer
  (S.pipe ([console.error, () => process.exit(1)])) // error callback
  (console.log);                                    // success callback

// happy path
test ('spec/fixtures/fake.jpg'); // -> "image/png; charset=binary"
// sad path
test ('no-such-file.jpg');       // -> "ERROR: cannot stat `no-such-file.jpg' (No such file or directory)"
```


## *nix file program

> Description: Recognize the type of data in a file using "magic" numbers
> The file command is "a file type guesser", a command-line tool that
> tells you in words what kind of data a file contains.

[express]: http://expressjs.com/en/4x/api.html#express.static
