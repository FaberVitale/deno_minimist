import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "safely applies defaults",
  fn: () => {
    const fixture = {
      herp: "derp",
      z: 55,
      truthy: true,
      toString: "method name",
      __proto__: {
        aaa: 99,
      },
      g: [],
      constructor: ([]).constructor,
      bar: {
        __proto__: {
          "bbb": 100,
        },
      },
    };

    const argv = parse(["--foo", "bar"] as any[], {
      alias: {
        z: "zoom",
      },
      default: fixture,
    });

    assertEquals(argv, {
      _: [],
      foo: "bar",
      herp: "derp",
      z: 55,
      zoom: 55,
      g: [],
      constructor: ([]).constructor,
      truthy: true,
      toString: "method name",
      bar: {},
    });
  },
});
