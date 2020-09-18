import parse from "../mod.ts";
import type { WithParsedArgs } from "../mod.ts";

const argv = parse<
  WithParsedArgs<Record<"h" | "H", string | number | boolean>>
>(Deno.args, { alias: { H: ["help"], a: "all" } });

console.log(argv);
