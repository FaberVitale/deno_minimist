import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

Deno.test({
  name: "whitespace should be whitespace",
  fn: () => {
    assertEquals(parse(["-x", "\t"]).x, "\t");
  },
});
