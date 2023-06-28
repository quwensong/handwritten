import Axios from "./core/Axios";
import { extend } from "./helpers/util";
import defaults from "./defaults";
import mergeConfig from "./core/mergeConfig";
import CancelToken from "./cancel/CancelToken";
import Cancel, { isCancel } from "./cancel/Cancel";

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

const axios = createInstance(defaults);

axios.create = function (config) {
  return createInstance(mergeConfig(defaults, config));
};
axios.CancelToken = CancelToken;
axios.Cancel = Cancel;
axios.isCancel = isCancel;

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
