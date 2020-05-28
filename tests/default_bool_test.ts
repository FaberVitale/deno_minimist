import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "boolean default true",
  fn: () => {
    const argv = parse([], {
      boolean: "sometrue",
      default: { sometrue: true },
    });
    assertEquals(argv.sometrue, true);
  },
});

Deno.test({
  name: "boolean default false",
  fn: () => {
    const argv = parse([], {
      boolean: "somefalse",
      default: { somefalse: false },
    });
    assertEquals(argv.somefalse, false);
  },
});

Deno.test({
  name: "boolean default to null",
  fn: () => {
    const expectNull = parse([], {
      boolean: "maybe",
      default: { maybe: null },
    });
    assertEquals(expectNull.maybe, null);

    const expectTrue = parse(["--maybe"], {
      boolean: "maybe",
      default: { maybe: null },
    });
    assertEquals(expectTrue.maybe, true);
  },
});
