import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "-",
  fn: () => {
    assertEquals(parse(["-n", "-"]), { n: "-", _: [] });
    assertEquals(parse(["-"]), { _: ["-"] });
    assertEquals(parse(["-f-"]), { f: "-", _: [] });
    assertEquals(
      parse(["-b", "-"], { boolean: "b" }),
      { b: true, _: ["-"] },
    );
    assertEquals(
      parse(["-s", "-"], { string: "s" }),
      { s: "-", _: [] },
    );
  },
});

Deno.test({
  name: "-a -- b",
  fn: () => {
    assertEquals(parse(["-a", "--", "b"]), { a: true, _: ["b"] });
    assertEquals(parse(["--a", "--", "b"]), { a: true, _: ["b"] });
    assertEquals(parse(["--a", "--", "b"]), { a: true, _: ["b"] });
  },
});

Deno.test({
  name: "move arguments after the -- into their own `--` array",
  fn: () => {
    assertEquals(
      parse(["--name", "John", "before", "--", "after"], { "--": true }),
      { name: "John", _: ["before"], "--": ["after"] },
    );
  },
});
