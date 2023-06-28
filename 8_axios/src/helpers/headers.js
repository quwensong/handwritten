import { isPlainObject } from "./util";

export const normalizeHeaderName = (headers, normalizedName) => {
  if (!headers) {
    return;
  }
  // 遍历所有 headers
  Object.keys(headers).forEach((name) => {
    // 处理这种情况 如果 name 是 content-type，normalizedName 是 Content-Type，则统一使用 Content-Type
    // 并且删除 content-type。
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  });
};
  
export const processHeaders = (headers, data) => {
  normalizeHeaderName(headers, "Content-Type");
  // 判断如果data数据是一个对象，则设置上'Content-Type'
  if (isPlainObject(data)) {
    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json;charset=utf-8";
    }
  }
  return headers;
};

export const parseHeaders = (headers) => {
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }

  headers.split("\r\n").forEach((line) => {
    let [key, ...vals] = line.split(":");
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    parsed[key] = vals.join(":").trim();
  });

  return parsed;
};
