import parse, { WithParsedArgs } from "../mod.ts";

const defaults = {
  a: null,
  b: { c: { d: [] } },
  e: [],
  version: "v1.0.0",
  port: 3000,
};

const argv = parse<WithParsedArgs<Record<keyof typeof defaults, unknown>>>(
  Deno.args,
  {
    default: defaults,
  },
);

console.log(argv);
