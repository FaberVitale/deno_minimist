import { assertEquals } from "../dev_deps.ts";
import parse, { WithParsedArgs } from "../mod.ts";

Deno.test({
  name: "flag boolean default false",
  fn: () => {
    const argv = parse(["moo"], {
      boolean: ["t", "verbose"],
      default: { verbose: false, t: false },
    });

    assertEquals(argv, {
      verbose: false,
      t: false,
      _: ["moo"],
    });

    assertEquals(typeof argv.verbose, "boolean");
    assertEquals(typeof argv.t, "boolean");
  },
});

Deno.test({
  name: "boolean groups",
  fn: () => {
    const argv = parse(["-x", "-z", "one", "two", "three"], {
      boolean: ["x", "y", "z"],
    });

    assertEquals(argv, {
      x: true,
      y: false,
      z: true,
      _: ["one", "two", "three"],
    });

    assertEquals(typeof argv.x, "boolean");
    assertEquals(typeof argv.y, "boolean");
    assertEquals(typeof argv.z, "boolean");
  },
});

Deno.test({
  name: "boolean flags combined",
  fn: () => {
    type BoolFlags = Record<"x" | "y" | "z", boolean>;

    const argv = parse<WithParsedArgs<BoolFlags>>(
      ["-xyz", "-z", "one", "two", "three"],
      {
        boolean: ["x", "y", "z", "w"],
      },
    );

    assertEquals(argv, {
      x: true,
      y: true,
      z: true,
      w: false,
      _: ["one", "two", "three"],
    });

    assertEquals(typeof argv.x, "boolean");
    assertEquals(typeof argv.y, "boolean");
    assertEquals(typeof argv.z, "boolean");
  },
});

Deno.test({
  name: "boolean and alias with chainable api",
  fn: () => {
    const aliased = ["-h", "derp"];
    const regular = ["--herp", "derp"];
    const opts = {
      herp: { alias: "h", boolean: true },
    };
    const aliasedArgv = parse(aliased, {
      boolean: "herp",
      alias: { h: "herp" },
    });
    const propertyArgv = parse(regular, {
      boolean: "herp",
      alias: { h: "herp" },
    });
    const expected = {
      herp: true,
      h: true,
      "_": ["derp"],
    };

    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
  },
});

Deno.test({
  name: "boolean and alias with options hash",
  fn: () => {
    const aliased = ["-h", "derp"];
    const regular = ["--herp", "derp"];
    const opts = {
      alias: { "h": "herp" },
      boolean: "herp",
    };
    const aliasedArgv = parse(aliased, opts);
    const propertyArgv = parse(regular, opts);
    const expected = {
      herp: true,
      h: true,
      "_": ["derp"],
    };

    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
  },
});

Deno.test({
  name: "boolean and alias array with options hash",
  fn: () => {
    const aliased = ["-h", "derp"];
    const regular = ["--herp", "derp"];
    const alt = ["--harp", "derp"];
    const opts = {
      alias: { "h": ["herp", "harp"] },
      boolean: "h",
    };
    const aliasedArgv = parse(aliased, opts);
    const propertyArgv = parse(regular, opts);
    const altPropertyArgv = parse(alt, opts);
    const expected = {
      harp: true,
      herp: true,
      h: true,
      "_": ["derp"],
    };

    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
    assertEquals(altPropertyArgv, expected);
  },
});

Deno.test({
  name: "boolean and alias using explicit true",
  fn: () => {
    const aliased = ["-h", "true"];
    const regular = ["--herp", "true"];
    const opts = {
      alias: { h: "herp" },
      boolean: "h",
    };
    const aliasedArgv = parse(aliased, opts);
    const propertyArgv = parse(regular, opts);
    const expected = {
      herp: true,
      h: true,
      "_": [],
    };

    assertEquals(aliasedArgv, expected);
    assertEquals(propertyArgv, expected);
  },
});

// regression, see https://github.com/substack/node-optimist/issues/71
Deno.test({
  name: "boolean and --x=true",
  fn: () => {
    let parsed = parse(["--boool", "--other=true"], {
      boolean: "boool",
    });

    assertEquals(parsed.boool, true);
    assertEquals(parsed.other, "true");

    parsed = parse(["--boool", "--other=false"], {
      boolean: "boool",
    });

    assertEquals(parsed.boool, true);
    assertEquals(parsed.other, "false");
  },
});

Deno.test({
  name: "boolean --boool=true",
  fn: () => {
    const parsed = parse(["--boool=true"], {
      default: {
        boool: false,
      },
      boolean: ["boool"],
    });

    assertEquals(parsed.boool, true);
  },
});

Deno.test({
  name: "boolean --boool=false",
  fn: () => {
    const parsed = parse(["--boool=false"], {
      default: {
        boool: true,
      },
      boolean: ["boool"],
    });

    assertEquals(parsed.boool, false);
  },
});

Deno.test({
  name: "boolean using something similar to true",
  fn: () => {
    const result = parse(["-h", "true.txt"], { boolean: "h" });
    const expected = {
      h: true,
      "_": ["true.txt"],
    };

    assertEquals(result, expected);
  },
});
