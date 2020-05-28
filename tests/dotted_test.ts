import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "dotted alias",
  fn: () => {
    const argv = parse(
      ["--a.b", "22"],
      { default: { "a.b": 11 }, alias: { "a.b": "aa.bb" } },
    );
    assertEquals(argv.a.b, 22);
    assertEquals(argv.aa.bb, 22);
  },
});

Deno.test({
  name: "dotted default",
  fn: () => {
    const argv = parse(
      [],
      { default: { "a.b": 11 }, alias: { "a.b": "aa.bb" } },
    );
    assertEquals(argv.a.b, 11);
    assertEquals(argv.aa.bb, 11);
  },
});

Deno.test({
  name: "dotted default with no alias",
  fn: () => {
    const argv = parse([], { default: { "a.b": 11 } });
    assertEquals(argv.a.b, 11);
  },
});
