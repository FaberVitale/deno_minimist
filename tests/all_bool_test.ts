import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

Deno.test({
  name: "flag boolean true (default all --args to boolean)",
  fn: () => {
    const argv = parse(["moo", "--honk", "cow"], {
      boolean: true,
    });

    assertEquals(argv, {
      honk: true,
      _: ["moo", "cow"],
    });

    assertEquals(typeof argv.honk, "boolean");
  },
});

Deno.test(
  {
    name: "flag boolean true (default all --args to boolean)",
    fn: () => {
      const argv = parse(["moo", "--honk", "cow"], {
        boolean: true,
      });

      assertEquals(argv, {
        honk: true,
        _: ["moo", "cow"],
      });

      assertEquals(typeof argv.honk, "boolean");
    },
  },
);

Deno.test(
  {
    name:
      "flag boolean true only affects double hyphen arguments without equals signs",
    fn: () => {
      const argv = parse(["moo", "--honk", "cow", "-p", "55", "--tacos=good"], {
        boolean: true,
      });

      assertEquals(argv, {
        honk: true,
        tacos: "good",
        p: 55,
        _: ["moo", "cow"],
      });

      assertEquals(typeof argv.honk, "boolean");
    },
  },
);
