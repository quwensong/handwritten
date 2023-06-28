export const isDate = (val) => {
  return toString.call(val) === "[object Date]";
};

export const isPlainObject = (val) => {
  return toString.call(val) === "[object Object]";
};

export const isURLSearchParams = (val) => {
  return typeof val !== "undefined" && val instanceof URLSearchParams;
};

export const extend = (to, from, ctx) => {
  Object.getOwnPropertyNames(from).forEach((key) => {
    to[key] = from[key].bind(ctx);
  });
  return to;
};
