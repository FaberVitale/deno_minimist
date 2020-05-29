import { assertEquals } from "../dev_deps.ts";
import parse from "../mod.ts";

Deno.test({
  name: "numeric short args",
  fn: () => {
    assertEquals(parse(["-n123"]), { n: 123, _: [] });
    assertEquals(
      parse(["-123", "456"]),
      { 1: true, 2: true, 3: 456, _: [] },
    );
  },
});

Deno.test({
  name: "short",
  fn: () => {
    assertEquals(
      parse(["-b"]),
      { b: true, _: [] },
      "short boolean",
    );
    assertEquals(
      parse(["foo", "bar", "baz"]),
      { _: ["foo", "bar", "baz"] },
      "bare",
    );
    assertEquals(
      parse(["-cats"]),
      { c: true, a: true, t: true, s: true, _: [] },
      "group",
    );
    assertEquals(
      parse(["-cats", "meow"]),
      { c: true, a: true, t: true, s: "meow", _: [] },
      "short group next",
    );
    assertEquals(
      parse(["-h", "localhost"]),
      { h: "localhost", _: [] },
      "short capture",
    );
    assertEquals(
      parse(["-h", "localhost", "-p", "555"]),
      { h: "localhost", p: 555, _: [] },
      "short captures",
    );
  },
});

Deno.test({
  name: "mixed short bool and capture",
  fn: () => {
    assertEquals(
      parse(["-h", "localhost", "-fp", "555", "script.js"]),
      {
        f: true,
        p: 555,
        h: "localhost",
        _: ["script.js"],
      },
    );
  },
});

Deno.test({
  name: "short and long",
  fn: () => {
    assertEquals(
      parse(["-h", "localhost", "-fp", "555", "script.js"]),
      {
        f: true,
        p: 555,
        h: "localhost",
        _: ["script.js"],
      },
    );
  },
});
