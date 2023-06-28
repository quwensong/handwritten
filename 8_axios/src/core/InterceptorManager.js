export default class InterceptorManager {
  constructor() {
    this.interceptors = [];
  }
  // 添加拦截器
  use(fulfilled, rejected) {
    // 向数组推入拦截器对象
    this.interceptors.push({
      fulfilled,
      rejected,
    });
    // 返回拦截器的index，用于删除拦截器
    return this.interceptors.length - 1;
  }
  // 删除拦截器
  eject(id) {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  // 遍历所有的拦截器
  forEach(fn) {
    this.interceptors.forEach((interceptor) => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    });
  }
}
