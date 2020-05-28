import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

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
