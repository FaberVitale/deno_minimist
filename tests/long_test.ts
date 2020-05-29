import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

Deno.test({
  name: "long opts",
  fn: () => {
    assertEquals(
      parse(["--bool"]),
      { bool: true, _: [] },
      "long boolean",
    );

    assertEquals(
      parse(["--pow", "xixxle"]),
      { pow: "xixxle", _: [] },
      "long capture sp",
    );

    assertEquals(
      parse(["--pow=xixxle"]),
      { pow: "xixxle", _: [] },
      "long capture eq",
    );

    assertEquals(
      parse(["--host", "localhost", "--port", "555"]),
      { host: "localhost", port: 555, _: [] },
      "long captures sp",
    );

    assertEquals(
      parse(["--host=localhost", "--port=555"]),
      { host: "localhost", port: 555, _: [] },
      "long captures eq",
    );
  },
});
