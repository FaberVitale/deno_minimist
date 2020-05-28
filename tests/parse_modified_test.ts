import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "parse with modifier functions",
  fn: () => {
    assertEquals(parse(["-b", "123"], { boolean: "b" }), { b: true, _: [123] });
  },
});
