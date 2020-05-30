export function hasKey(obj: Record<string, unknown>, keys: string[]) {
  const lastIndex = keys.length - 1;
  let o = obj;

  for (let i = 0; i < lastIndex; i++) {
    o = o[keys[i]] || Object.create(null);
  }

  return keys[lastIndex] in o;
}

export function isNumberLike(x: unknown) {
  return typeof x === "number" ||
    (typeof x === "string" && (/^0x[0-9a-f]+$/i.test(x) ||
      /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x)));
}
