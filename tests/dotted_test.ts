import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";
import type  { WithParsedArgs }  from "../mod.ts"

type Output = WithParsedArgs<{ a?: { b?: unknown }; aa?: { bb?: unknown } }>;

Deno.test({
  name: "dotted alias",
  fn: () => {
    const options = { default: { "a.b": 11 }, alias: { "a.b": "aa.bb" } };

    const argv = parse<
      Output
    >(
      ["--a.b", "22"],
      options,
    );
    assertEquals(argv?.a?.b, 22);
    assertEquals(argv?.aa?.bb, 22);
  },
});

Deno.test({
  name: "dotted default",
  fn: () => {
    const argv = parse<Output>(
      [],
      { default: { "a.b": 11 }, alias: { "a.b": "aa.bb" } },
    );
    assertEquals(argv?.a?.b, 11);
    assertEquals(argv?.aa?.bb, 11);
  },
});

Deno.test({
  name: "dotted default with no alias",
  fn: () => {
    const argv = parse<Output>([], { default: { "a.b": 11 } });
    assertEquals(argv?.a?.b, 11);
  },
});
