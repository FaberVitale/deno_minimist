import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

Deno.test(
  {
    name: "stops parsing on the first non-option when stopEarly is set",
    fn: () => {
      const argv = parse(["--aaa", "bbb", "ccc", "--ddd"], {
        stopEarly: true,
      });

      assertEquals(argv, {
        aaa: "bbb",
        _: ["ccc", "--ddd"],
      });
    },
  },
);
