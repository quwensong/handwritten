import { isPlainObject } from "./util";

/**
 * 如果 data 是普通对象，转换成 JSON 字符串
 * @param {*} data
 * @returns
 */
export const transformRequest = (data) => {
  if (isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
};

/**
 * 如果 data 是 string 类型，试图转换成 JSON 类型
 * @param {*} data
 * @returns
 */
export const transformResponse = (data) => {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {}
  }
  return data;
};
