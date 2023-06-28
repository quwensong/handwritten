import { buildURL } from "../helpers/url";
import { processHeaders } from "../helpers/headers";
import { transformRequest, transformResponse } from "../helpers/data";
import xhrAdapter  from "../adapters/xhr"
import httpAdapter  from "../adapters/http"


/**
 * 将 url 和 params 拼接成一个完整的 url
 * @param {*} config
 * @returns
 */
const transformURL = (config) => {
  const { url, params } = config;
  return buildURL(url, params);
};

/**
 * 处理 headers，如果 data 是普通对象，添加 Content-Type: application/json;charset=utf-8
 * @param {*} config
 * @returns
 */
const transformHeaders = (config) => {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
};

/**
 * 处理 data，如果 data 是普通对象，转换成 JSON 字符串
 * @param {*} config
 * @returns
 */
const transformRequestData = (config) => {
  const { data = {} } = config;

  return transformRequest(data);
};

/**
 * 处理传入的配置函数
 * @param {*} config
 */
const processConfig = (config) => {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  config.data = transformRequestData(config);
};

/**
 * 处理响应数据，将响应数据转换成 JSON 对象
 * @param {*} res
 * @returns
 */
const transformResponseData = (res) => {
  res.data = transformResponse(res.data);
  return res;
};

/**
 * 如果浏览器支持 XMLHttpRequest，就使用 xhr 适配器
 * 如果不支持，就使用 http 适配器
 * @returns
 */
const getDefaultAdapter = () => {
  let adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    // 浏览器
    adapter = xhrAdapter;

  } else if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // node.js
    adapter = httpAdapter;
  }
  return adapter;
};

const dispatchRequest = (config) => {
  const adapter = config.adapter || getDefaultAdapter();

  // 处理传入的配置
  processConfig(config);
  // 发送请求
  return adapter(config).then((res) => transformResponseData(res));
};

export default dispatchRequest;
