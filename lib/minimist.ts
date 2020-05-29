import { MinimistOptions, ParsedArgs, Minimist } from "../types/minimist.d.ts";
import { isNumberLike, hasKey } from "./_utils.ts";

type Flags = {
  bools: Record<string, boolean>;
  strings: Record<string, boolean>;
  allBools: boolean;
};

type MinimistContext = {
  options: MinimistOptions;
  defaults: NonNullable<MinimistOptions["default"]>;
  flags: Flags;
  aliases: Record<string, string[]>;
  unknownFn: null | NonNullable<MinimistOptions["unknown"]>;
  argv: ParsedArgs;
  args: string[];
  notFlags: string[];
};

function computeAliases(opts: MinimistOptions): Record<string, string[]> {
  const aliases: Record<string, string[]> = Object.create(null);

  if (!opts.alias) {
    return aliases;
  }

  const keys = Object.keys(opts.alias);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];

    aliases[key] = [].concat(opts.alias[key] as any);

    for (let j = 0; j < aliases[key].length; j++) {
      aliases[aliases[key][j]] = [key].concat(
        aliases[key].filter((y) => aliases[key][j] !== y),
      );
    }
  }

  return aliases;
}

function createMinimistContext(inputArgs: string[], opts?: MinimistOptions) {
  const options = opts || Object.create(null);
  const defaults = Object.assign(Object.create(null), options.default);
  const flags: Flags = {
    bools: Object.create(null),
    strings: Object.create(null),
    allBools: false,
  };

  const aliases: Record<string, string[]> = computeAliases(options);

  const output: MinimistContext = {
    args: inputArgs,
    options,
    defaults,
    flags,
    aliases,
    unknownFn: null,
    argv: Object.assign(Object.create(null), { _: [] }),
    notFlags: [],
  };

  if (typeof options.unknown === "function") {
    output.unknownFn = options["unknown"];
  }

  if (options.boolean) {
    if (typeof options.boolean === "boolean") {
      flags.allBools = true;
    } else if (typeof options.boolean === "string") {
      flags.bools[options.boolean] = true;
    } else if (Array.isArray(options.boolean)) {
      for (let i = 0, len = options.boolean.length; i < len; i++) {
        flags.bools[options.boolean[i]] = true;
      }
    }
  }

  if (options.string) {
    const strings = [].concat(options.string as any);

    for (let i = 0, len = options.string.length; i < len; i++) {
      const key = strings[i];

      if (key) {
        flags.strings[key] = true;
      }

      if (aliases[key]) {
        flags.strings[aliases[key] + ""] = true;
      }
    }
  }

  if (output.args.indexOf("--") !== -1) {
    output.notFlags = inputArgs.slice(inputArgs.indexOf("--") + 1);
    output.args = inputArgs.slice(0, inputArgs.indexOf("--"));
  }

  return output;
}

function aliasIsBoolean({ aliases, flags }: MinimistContext, key: string) {
  return aliases[key].some((val) => flags.bools[val]);
}

function argDefined(
  { aliases, flags }: MinimistContext,
  key: string,
  arg: string,
) {
  return (flags.allBools && /^--[^=]+$/.test(arg)) ||
    flags.strings[key] || flags.bools[key] || aliases[key];
}

function setKey(
  { flags }: MinimistContext,
  obj: Record<string, any>,
  keys: string[],
  value: unknown,
) {
  let o = obj;
  const len = keys.length;

  for (let i = 0; i < len - 1; i++) {
    const key = keys[i];

    if (key === "__proto__") {
      return;
    }

    if (o[key] === undefined) {
      o[key] = Object.create(null);
    }

    o = o[key];
  }

  const key = keys[len - 1];

  if (key === "__proto__") {
    return;
  }

  if (
    o === Object.prototype ||
    o === Number.prototype ||
    o === String.prototype
  ) {
    o = Object.create(null);
  }

  if (o === Array.prototype) {
    o = [];
  }

  if (
    o[key] === undefined ||
    flags.bools[key] ||
    typeof o[key] === "boolean"
  ) {
    o[key] = value;
  } else if (Array.isArray(o[key])) {
    o[key].push(value);
  } else {
    o[key] = [o[key], value];
  }
}

function setArg(
  ctx: MinimistContext,
  key: string,
  val: unknown,
  arg?: string,
) {
  if (arg && ctx.unknownFn && !argDefined(ctx, key, arg)) {
    if (ctx.unknownFn(arg) === false) {
      return;
    }
  }

  const value = !ctx.flags.strings[key] && isNumberLike(val)
    ? Number(val)
    : val;
  setKey(ctx, ctx.argv, key.split("."), value);

  if (ctx.aliases[key]) {
    for (let i = 0, len = ctx.aliases[key].length; i < len; i++) {
      setKey(ctx, ctx.argv, ctx.aliases[key][i].split("."), value);
    }
  }
}

function consumeArgs(ctx: MinimistContext) {
  const { flags, aliases, args, argv, options } = ctx;

  const boolsKeys = Object.keys(ctx.flags.bools);

  for (let i = 0, len = boolsKeys.length; i < len; i++) {
    const key = boolsKeys[i];
    setArg(
      ctx,
      key,
      ctx.defaults[key] === undefined ? false : ctx.defaults[key],
    );
  }

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];

    if (/^--.+=/.test(arg)) {
      // Using [\s\S] instead of . because js doesn't support the
      // 'dotall' regex modifier. See:
      // http://stackoverflow.com/a/1068308/13216
      const match = arg.match(/^--([^=]+)=([\s\S]*)$/)!;
      const key = match[1];
      let value: string | boolean = match[2];

      if (flags.bools[key]) {
        value = value !== "false";
      }

      setArg(ctx, key, value, arg);
    } else if (/^--no-.+/.test(arg)) {
      var key = arg.match(/^--no-(.+)/)![1];
      setArg(ctx, key, false, arg);
    } else if (/^--.+/.test(arg)) {
      var key = arg.match(/^--(.+)/)![1];
      var next = args[i + 1];
      if (
        next !== undefined && !/^-/.test(next) &&
        !flags.bools[key] &&
        !flags.allBools &&
        (aliases[key] ? !aliasIsBoolean(ctx, key) : true)
      ) {
        setArg(ctx, key, next, arg);
        i++;
      } else if (/^(true|false)$/.test(next)) {
        setArg(ctx, key, next === "true", arg);
        i++;
      } else {
        setArg(ctx, key, flags.strings[key] ? "" : true, arg);
      }
    } else if (/^-[^-]+/.test(arg)) {
      var letters = arg.slice(1, -1).split("");

      var broken = false;
      for (var j = 0; j < letters.length; j++) {
        var next = arg.slice(j + 2);

        if (next === "-") {
          setArg(ctx, letters[j], next, arg);
          continue;
        }

        if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
          setArg(ctx, letters[j], next.split("=")[1], arg);
          broken = true;
          break;
        }

        if (
          /[A-Za-z]/.test(letters[j]) &&
          /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)
        ) {
          setArg(ctx, letters[j], next, arg);
          broken = true;
          break;
        }

        if (letters[j + 1] && letters[j + 1].match(/\W/)) {
          setArg(ctx, letters[j], arg.slice(j + 2), arg);
          broken = true;
          break;
        } else {
          setArg(ctx, letters[j], flags.strings[letters[j]] ? "" : true, arg);
        }
      }

      var key = arg.slice(-1)[0];
      if (!broken && key !== "-") {
        if (
          args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) &&
          !flags.bools[key] &&
          (aliases[key] ? !aliasIsBoolean(ctx, key) : true)
        ) {
          setArg(ctx, key, args[i + 1], arg);
          i++;
        } else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
          setArg(ctx, key, args[i + 1] === "true", arg);
          i++;
        } else {
          setArg(ctx, key, flags.strings[key] ? "" : true, arg);
        }
      }
    } else {
      if (!ctx.unknownFn || ctx.unknownFn(arg) !== false) {
        // `flags.strings["_"]` determines if the non options
        // values can be casted to string.
        const nonOptionArg = (flags.strings["_"] || !isNumberLike(arg))
          ? arg
          : Number(arg);

        argv._.push(nonOptionArg);
      }

      if (options.stopEarly) {
        argv._.push.apply(argv._, args.slice(i + 1));
        break;
      }
    }
  }

  Object.keys(ctx.defaults).forEach(function (key) {
    if (!hasKey(argv, key.split("."))) {
      setKey(ctx, argv, key.split("."), ctx.defaults[key]);

      (aliases[key] || []).forEach(function (x) {
        setKey(ctx, argv, x.split("."), ctx.defaults[key]);
      });
    }
  });

  if (ctx.options["--"]) {
    argv["--"] = ctx.notFlags;
  } else {
    argv._.push.apply(argv._, ctx.notFlags);
  }

  return argv;
}

export const parse: Minimist = function parse<T extends ParsedArgs>(
  args: string[],
  opts?: MinimistOptions,
): T {
  if (!args) {
    throw new TypeError("minimist: no args provided");
  }

  const ctx = createMinimistContext(args, opts);

  return consumeArgs(ctx) as T;
};
