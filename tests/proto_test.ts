import { assertEquals } from "../dev_deps.ts";
import parse from "../lib/minimist.ts";

Deno.test({
  name: "proto pollution",
  fn: () => {
    const argv = parse(["--__proto__.x", "123"]);

    assertEquals(({} as any).x, undefined);
    // https://github.com/denoland/deno/issues/5133#issuecomment-627755122
    assertEquals(Object.getPrototypeOf(argv).x, undefined);
    assertEquals(argv.x, undefined);
  },
});

Deno.test({
  name: "proto pollution (array)",
  fn: () => {
    const argv = parse(["--x", "4", "--x", "5", "--x.__proto__.z", "789"]);
    assertEquals(({} as any).z, undefined);
    assertEquals(argv.x, [4, 5]);
    assertEquals(argv?.x?.z, undefined);
    assertEquals(Object.getPrototypeOf(argv.x).z, undefined);
  },
});

Deno.test({
  name: "proto pollution (number)",
  fn: () => {
    const argv = parse(["--x", "5", "--x.__proto__.z", "100"]);
    assertEquals(({} as any).z, undefined);
    assertEquals((4 as any).z, undefined);
    assertEquals(argv.x, [4, 5]);
    assertEquals(argv?.x?.z, undefined);
  },
});

Deno.test({
  name: "proto pollution (string)",
  fn: () => {
    const argv = parse(["--x", "abc", "--x.__proto__.z", "def"]);
    assertEquals(({} as any).z, undefined);
    assertEquals(("..." as any).z, undefined);
    assertEquals(argv.x, "abc");
    assertEquals(argv?.x?.z, undefined);
  },
});

Deno.test({
  name: "proto pollution (constructor)",
  fn: () => {
    const argv = parse(["--constructor.prototype.y", "123"]);
    assertEquals(({} as any).y, undefined);
    assertEquals(argv.y, undefined);
  },
});
