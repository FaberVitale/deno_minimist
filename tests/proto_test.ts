import { assertEquals } from "../dev_deps.ts";
import parse, { WithParsedArgs } from "../mod.ts";

type ParseOutput = WithParsedArgs<
  { x?: Record<string, unknown>; y?: Record<string, unknown> }
>;

Deno.test({
  name: "proto pollution",
  fn: () => {
    const argv = parse<ParseOutput>(["--__proto__.x", "123"]);

    assertEquals(({} as any).x, undefined);
    // https://github.com/denoland/deno/issues/5133#issuecomment-627755122
    assertEquals(Object.getPrototypeOf(argv)?.x, undefined);
    assertEquals(argv.x, undefined);
  },
});

Deno.test({
  name: "proto pollution (array)",
  fn: () => {
    const argv = parse<ParseOutput>(
      ["--x", "4", "--x", "5", "--x.__proto__.z", "789"],
    );

    assertEquals(({} as any).z, undefined);
    assertEquals(argv.x, [4, 5]);
    assertEquals(argv?.x?.z, undefined);
    assertEquals(Object.getPrototypeOf(argv.x).z, undefined);
  },
});

Deno.test({
  name: "proto pollution (number)",
  fn: () => {
    const argv = parse<ParseOutput>(["--x", "5", "--x.__proto__.z", "100"]);
    assertEquals(({} as any).z, undefined);
    assertEquals((4 as any).z, undefined);
    assertEquals(argv.x, 5);
    assertEquals(argv?.x?.z as any, undefined);
  },
});

Deno.test({
  name: "proto pollution (string)",
  fn: () => {
    const argv = parse<ParseOutput>(["--x", "abc", "--x.__proto__.z", "def"]);
    assertEquals(({} as any).z, undefined);
    assertEquals(("..." as any).z, undefined);
    assertEquals(argv.x, "abc");
    assertEquals(argv?.x?.z as any, undefined);
  },
});

Deno.test({
  name: "proto pollution (constructor)",
  fn: () => {
    const argv = parse(["--constructor.prototype.y", "123"]);

    assertEquals(({} as any).y, undefined);
    assertEquals(argv.y, undefined);
  },
});

Deno.test({
  name: "special option names option (string)",
  fn: () => {
    const argv = parse(
      [
        "--constructor.prototype.name",
        "rer",
        "--constructor.name.constructor.toString",
        "re",
        "--constructor.name.constructor.toString",
        "er",
      ],
    );

    assertEquals(typeof ({}).toString, "function");
    assertEquals(typeof ([]).toString, "function");
    assertEquals(
      argv,
      {
        _: [],
        constructor: {
          prototype: { name: "rer" },
          name: { constructor: { toString: ["re", "er"] } },
        },
      },
    );
  },
});

Deno.test({
  name: "'constructor' option (string)",
  fn: () => {
    const argv = parse(
      ["--constructor", "34"],
      { alias: { c: "constructor" }, string: ["c"] },
    );

    assertEquals(argv, { _: [], constructor: "34", c: "34" });
  },
});
