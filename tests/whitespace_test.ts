import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "whitespace should be whitespace",
  fn: () => {
    assertEquals(parse(["-x", "\t"]).x, "\t");
  },
});
