const Hook = require("./Hook");

const TAP_ASYNC = () => {
  throw new Error("tapAsync is not supported on a SyncHook");
};

const TAP_PROMISE = () => {
  throw new Error("tapPromise is not supported on a SyncHook");
};
/**
 * 所以这里当我们进行 new SyncHook 时
首先通过 new Hook(args, name) 创建了基础的 hook 实例对象。
同步的 hook 是不存在 tapAsync 和 tapPromise 方法的，所以这里给 hook 对象这两个方法分别赋予对应的错误函数。
返回 hook 实例对象，并且将 SyncHook 的原型置为 null。
此时我们通过 new SyncHook([1,2]) 时就会返回对应的 hook 实例对象。
 * @param {*} args 
 * @param {*} name 
 * @returns 
 */
function SyncHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncHook;
  hook.tapAsync = TAP_ASYNC;
  hook.tapPromise = TAP_PROMISE;
  // COMPILE 方法你可以暂时忽略它 这里我也没有实现COMPILE方法
  hook.compile = COMPILE;
  return hook;
}

SyncHook.prototype = null;

module.exports = SyncHook;
