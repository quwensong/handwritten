import dispatchRequest from "./dispatchRequest";

class Axios {
  // 用来存储配置信息。
  config = {};
  constructor(initConfig) {
    // 实例化时接收一个配置信息，并保存到config属性中。
    this.config = initConfig;
  }
  // 该类有一个 request 方法，它可以用来发送请求
  request(config) {
    return dispatchRequest(config);
  }

  get(url, config) {
    return this._requestMethodWithoutData("get", url, config);
  }
  delete(url, config) {
    return this._requestMethodWithoutData("delete", url, config);
  }

  head(url, config) {
    return this._requestMethodWithoutData("head", url, config);
  }

  options(url, config) {
    return this._requestMethodWithoutData("head", url, config);
  }

  post(url, data, config) {
    return this._requestMethodWithData("post", url, data, config);
  }

  put(url, data, config) {
    return this._requestMethodWithData("put", url, data, config);
  }

  patch(url, data, config) {
    return this._requestMethodWithData("patch", url, data, config);
  }

  // 通用不带Data的调用方法，其本质就是调用 request 方法
  _requestMethodWithoutData(method, url, config) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
      })
    );
  }
  // 通用带Data调用方法
  _requestMethodWithData(method, url, data, config) {
    // 合并参数
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data,
      })
    );
  }
}

export default Axios;
