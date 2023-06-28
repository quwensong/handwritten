import { parseHeaders } from "../helpers/headers";
import { isURLSameOrigin } from "../helpers/url";
import { createError } from "../core/error";
import cookie from "../helpers/cookie";

export default function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    // 解构config，data 如果不传默认为null，method 不传默认为 get方法，url是必传参数
    let {
      data = null,
      url,
      method = "get",
      headers = {},
      responseType,
      timeout,
      withCredentials,
      cancelToken,
    } = config;

    // 创建 xhr 对象
    const request = new XMLHttpRequest();

    // 判断用户是否设置了返回数据类型
    if (responseType) {
      request.responseType = responseType;
    }
    // 判断是否有超时的配置，如果有则给request添加超时属性
    if (timeout) {
      request.timeout = timeout;
    }
    // 设置 xhr 对象的 withCredentials 属性即可
    /**
     * 在同域情况下，发送请求会默认携带当前域下的 cookie，但是跨域的情况下，默认是不会携带请求域下的 cookie，如果想携带，只需要设置请求的 xhr 对象的 withCredentials 为 true 即可。
     */
    if (withCredentials) {
      request.withCredentials = withCredentials;
    }

    // 判断如果是配置 withCredentials 为 true，或者是同域请求并且 xsrfCookieName 存在
    // 才会在请求 headers 添加 xsrf 相关字段。
    if ((withCredentials || isURLSameOrigin(url)) && xsrfCookieName) {
      // 通过cookie 去读取对应的 xsrfHeaderName 值
      const xsrfValue = cookie.read(xsrfCookieName);
      if (xsrfValue && xsrfHeaderName) {
        headers[xsrfHeaderName] = xsrfValue;
      }
    }

    // 打开一个请求
    request.open(method.toUpperCase(), url, true);
    // 监听状态变化
    request.onreadystatechange = () => {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 0) {
        return;
      }
      // 返回的 header 是字符串类型，通过 parseHeaders 解析成对象类型
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData =
        responseType && responseType !== "text"
          ? request.response
          : request.responseText;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      };
      // 如果状态码在 200-300 之间正常 resolve，否则 reject 错误
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        );
      }
    };
    // 监听错误
    request.onerror = () => {
      reject(createError(`Network Error`, config, null, request));
    };
    // 监听超时
    request.ontimeout = () => {
      // ECONNABORTED 通常表示一个被中止的请求
      reject(
        createError(
          `Timeout of ${config.timeout} ms exceeded`,
          config,
          "ECONNABORTED",
          request
        )
      );
    };

    // 遍历所有处理后的 headers
    console.log(headers);
    Object.keys(headers).forEach((name) => {
      // 如果 data 为空的话，则删除 content-type
      if (data === null && name.toLowerCase() === "content-type") {
        delete headers[name];
      } else {
        // 给请求设置上 header
        request.setRequestHeader(name, JSON.stringify(headers[name]));
      }
    });

    if (cancelToken) {
      cancelToken.promise
        .then((reason) => {
          request.abort();
          reject(reason);
        })
        .catch(() => {});
    }

    request.send(data);
  });
}
