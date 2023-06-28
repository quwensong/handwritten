import Axios from "./core/Axios";
import { extend } from "./helpers/util";

function createInstance(config) {
  // 实例化一个 Axios 类
  const context = new Axios(config);
  // 把 Axios 类的 request 方法赋值给 instance,变量 instance 保存了 Axios 类上的 request 方法，并使用上一步实例化的对象去接替该方法中的 this。
  const instance = Axios.prototype.request.bind(context);
  // 如果想 axios.request、axios.get 调用
  // 可以让 instance 继承 context 上的 request、get、post 等方法。
  extend(instance, Axios.prototype, context);
  // 返回的其实是 request 方法,这样一来 instance 就继承了 Axios 类上定义的属性及方法了。现在就可以直接这样调用了：
  // axios.get('/user?ID=12345')  axios.request({url:"/user?ID=12345"})
  return instance;
}

// 默认参数对象，如果用户不传入 method，则默认为 git
const defaults = {
  method: "get",
};

const axios = createInstance(defaults);

axios.create = function () {
  // 合并默认配置与用户传入的配置，并作为 createInstance 的参数参入，
  // 目前合并config未实现。因此直接传了 default 去创建实例。
  // const initConfig = mergeConfig(config,defaults);
  return createInstance(defaults);
};

axios({
  method: "post",
  url: "https://reqres.in/api/users",
  data: {
    name: "frankshi",
    job: "FE",
  },
  headers: {
    "content-type": "application/json;charset=utf-8",
  },
});

export default axios;
