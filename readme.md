# deno_minimist

💾 Parses command line arguments. 

Port & rewrite to [deno](https://deno.land/) & [typescript](https://www.typescriptlang.org/) of the node library [minimist](https://github.com/substack/minimist).

---

## example

```typescript
import parseArgs from './mod.ts';

parseArgs(Deno.args);
```

```bash
$ deno run ./examples/parse.ts -a beep -b boop
{ _: [], a: 'beep', b: 'boop' }
```

```bash
$ deno run ./examples/parse.ts -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
{ _: [ 'foo', 'bar', 'baz' ],
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: 'boop' }
```

## API

```typescript
import parseArgs from './mod.ts';

parseArgs(Deno.args);
```

## const argv = parseArgs(args, opts={})

Returns an argument object `argv` populated with the array arguments from `args`.

`argv._` contains all the arguments that didn't have an option associated with
them.

Numeric-looking arguments will be returned as numbers unless `opts.string` or
`opts.boolean` is set for that argument name.

Any arguments after `'--'` will not be parsed and will end up in `argv._`.

options can be:

* `opts.string` - a string or array of strings argument names to always treat as
strings

* `opts.boolean` - a boolean, string or array of strings to always treat as
booleans. if `true` will treat all double hyphenated arguments without equal signs
as boolean (e.g. affects `--foo`, not `-f` or `--foo=bar`)

* `opts.alias` - an object mapping string names to strings or arrays of string
argument names to use as aliases

* `opts.default` - an object mapping string argument names to default values

* `opts.stopEarly` - when true, populate `argv._` with everything after the
first non-option

* `opts['--']` - when true, populate `argv._` with everything before the `--`
and `argv['--']` with everything after the `--`. Here's an example:

```typescript
import parseArgs from './mod.ts';
parseArgs('one two three -- four five --six'.split(' '), {'--': true });
```

Note that with `opts['--']` set, parsing for arguments still stops after the
`--`.

* `opts.unknown` - a function which is invoked with a command line parameter not
defined in the `opts` configuration object. If the function returns `false`, the
unknown option is not added to `argv`.

---

## Relevant changes compared to minimist

* An explicit TypeError is raised if the input is falsy.

* `--constructor` option is supported.

* Added few tests.

* Improved accuracy and ergonomics of typescript types.

* The returned payload is an object created using `Object.create(null)`, hence 
  does not have instance methods like `toString`:
  
```typescript
// parse(Deno.args).toString() : Uncaught TypeError: parse(...).toString is not a function

parse(Deno.args).toString(); // BAD - `Uncaught TypeError`
parse(Deno.args) + "";       // BAD - `Uncaught TypeError`

Object.prototype.toString.call(parse(Deno.args)); // OK `[object Object]`

JSON.stringify(parse(['--foo'])); // OK `{"_":[],"foo":true}`
```


## License

[MIT](./LICENSE)
