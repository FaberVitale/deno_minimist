import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

Deno.test({
  name: "boolean and alias is not unknown",
  fn: () => {
    const unknown: unknown[] = [];

    function unknownFn(arg: unknown) {
      unknown.push(arg);

      return false;
    }

    const aliased = ["-h", "true", "--derp", "true"];
    const regular = ["--herp", "true", "-d", "true"];
    const opts = {
      alias: { h: "herp" },
      boolean: "h",
      unknown: unknownFn,
    };

    parse(aliased, opts);
    parse(regular, opts);

    assertEquals(unknown, ["--derp", "-d"]);
  },
});

Deno.test(
  {
    name: "flag boolean true any double hyphen argument is not unknown",
    fn: () => {
      const unknown: unknown[] = [];

      function unknownFn(arg: unknown) {
        unknown.push(arg);

        return false;
      }

      var argv = parse(["--honk", "--tacos=good", "cow", "-p", "55"], {
        boolean: true,
        unknown: unknownFn,
      });
      assertEquals(unknown, ["--tacos=good", "cow", "-p"]);
      assertEquals(argv, {
        honk: true,
        _: [],
      });
    },
  },
);

Deno.test({
  name: "string and alias is not unknown",
  fn: () => {
    const unknown: unknown[] = [];

    function unknownFn(arg?: unknown) {
      unknown.push(arg);

      return false;
    }
    const aliased = ["-h", "hello", "--derp", "goodbye"];
    const regular = ["--herp", "hello", "-d", "moon"];
    const opts = {
      alias: { h: "herp" },
      string: "h",
      unknown: unknownFn,
    };
    const aliasedArgv = parse(aliased, opts);
    const propertyArgv = parse(regular, opts);

    assertEquals(unknown, ["--derp", "-d"]);
  },
});

Deno.test({
  name: "default and alias is not unknown",
  fn: () => {
    const unknown: unknown[] = [];
    const unknownFn = (arg?: unknown) => {
      unknown.push(arg);
      return false;
    };

    const aliased = ["-h", "hello"];
    const regular = ["--herp", "hello"];
    const opts = {
      default: { "h": "bar" },
      alias: { "h": "herp" },
      unknown: unknownFn,
    };

    parse(aliased, opts);
    parse(regular, opts);

    assertEquals(unknown, []);

    unknownFn(); // exercise fn for 100% coverage
  },
});

Deno.test({
  name: "value following -- is not unknown",
  fn: () => {
    const unknown: unknown[] = [];
    const unknownFn = (arg?: unknown) => {
      unknown.push(arg);
      return false;
    };

    const aliased = ["--bad", "--", "good", "arg"];
    const opts = {
      "--": true,
      unknown: unknownFn,
    };
    const argv = parse(aliased, opts);

    assertEquals(unknown, ["--bad"]);
    assertEquals(argv, {
      "--": ["good", "arg"],
      "_": [],
    });
  },
});
