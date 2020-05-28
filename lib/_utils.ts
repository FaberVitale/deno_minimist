export function hasKey(obj: Record<string, any>, keys: string[]) {
  console.log(obj, keys);
  const len = keys.length;
  let o = obj;

  for (let i = 0; i < len - 1; i++) {
    o = o[keys[i]] || {};
  }

  return keys[len - 1] in o;
}

export function isNumberLike(x: unknown) {
  return typeof x === "number" ||
    (typeof x === "string" && (/^0x[0-9a-f]+$/i.test(x) ||
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x)));
}
