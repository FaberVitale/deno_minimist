import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

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
  name: "boolean and alias with chainable api",
  fn: () => {
    var aliased = ["-h", "derp"];
    var regular = ["--herp", "derp"];
    var opts = {
      herp: { alias: "h", boolean: true },
    };
    var aliasedArgv = parse(aliased, {
      boolean: "herp",
      alias: { h: "herp" },
    });
    var propertyArgv = parse(regular, {
      boolean: "herp",
      alias: { h: "herp" },
    });
    var expected = {
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
    var aliased = ["-h", "derp"];
    var regular = ["--herp", "derp"];
    var opts = {
      alias: { "h": "herp" },
      boolean: "herp",
    };
    var aliasedArgv = parse(aliased, opts);
    var propertyArgv = parse(regular, opts);
    var expected = {
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
    var aliased = ["-h", "derp"];
    var regular = ["--herp", "derp"];
    var alt = ["--harp", "derp"];
    var opts = {
      alias: { "h": ["herp", "harp"] },
      boolean: "h",
    };
    var aliasedArgv = parse(aliased, opts);
    var propertyArgv = parse(regular, opts);
    var altPropertyArgv = parse(alt, opts);
    var expected = {
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
    var aliased = ["-h", "true"];
    var regular = ["--herp", "true"];
    var opts = {
      alias: { h: "herp" },
      boolean: "h",
    };
    var aliasedArgv = parse(aliased, opts);
    var propertyArgv = parse(regular, opts);
    var expected = {
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
    var parsed = parse(["--boool", "--other=true"], {
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
    var parsed = parse(["--boool=true"], {
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
    var parsed = parse(["--boool=false"], {
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
    var result = parse(["-h", "true.txt"], { boolean: "h" });
    var expected = {
      h: true,
      "_": ["true.txt"],
    };

    assertEquals(result, expected);
  },
});
