import dispatchRequest from "./dispatchRequest";
import mergeConfig from "./mergeConfig";
import InterceptorManager from "./InterceptorManager";

class Axios {
  // 用来存储配置信息。
  defaults = {};
  interceptors = {};

  constructor(initConfig) {
    // 实例化时接收一个配置信息，并保存到config属性中。
    this.defaults = initConfig;
    // 拦截器对象中包含：request拦截器以及response拦截器
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }
  // 该类有一个 request 方法，它可以用来发送请求
  request(url, config) {
    if (typeof url === "string") {
      if (!config) {
        config = {};
      }
      config.url = url;
    } else {
      config = url;
    }
    // 合并默认配置与用户传进来的配置
    config = mergeConfig(this.defaults, config);

    const chain = [
      {
        resolved: dispatchRequest,
        rejected: undefined,
      },
    ];
    // 当用户使用 axios.interceptors.request.use(...) 推入了多个请求拦截器时
    // this.interceptors.request 这里面就有多个拦截器，通过遍历拦截器，插入 chain 数组的前面
    this.interceptors.request.forEach((interceptor) => {
      chain.unshift(interceptor);
    });
    // 当用户使用 axios.interceptors.response.use(...) 推入多个响应拦截器时
    // this.interceptors.response 这里面就有多个拦截器，通过遍历拦截器，插入 chain 数组的后面
    this.interceptors.response.forEach((interceptor) => {
      chain.push(interceptor);
    });

    // 此时的 chain 应该是这样的
    /*
    [
    	{
      	resolved:(config)=>{...}, // 用户自定义请求拦截器
        rejected:(config)=>{...}
      },
      ...
      {
        resolved: dispatchRequest,
        rejected: undefined
      },
      ...
      {
      	resolved:(res)=>{...}, // 用户自定义响应拦截器
        rejected:(res)=>{...}
      },
    ]
    */
    let promise = Promise.resolve(config);
    // 如果 chain 数组中有值就进入循环遍历
    while (chain.length) {
      // 每次取出数组的第一个元素，并从数组中删除
      const { resolved, rejected } = chain.shift();
      // promise 复制为下一次 promise.then，实现拦截器链式传递
      // resolved 是请求拦截器，rejected 是响应拦截器
      promise = promise.then(resolved, rejected);
    }

    // 最终全部执行完成之后，返回最后的执行结果
    return promise;
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
