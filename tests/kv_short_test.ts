import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "short -k=v",
  fn: () => {
    const argv = parse(["-b=123"]);
    assertEquals(argv, { b: 123, _: [] });
  },
});

Deno.test({
  name: "multi short -k=v",
  fn: () => {
    const argv = parse(["-a=whatever", "-b=robots"]);

    assertEquals(argv, { a: "whatever", b: "robots", _: [] });
  },
});
