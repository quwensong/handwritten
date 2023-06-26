// 我们先来看看 Hook 父类对象，所有类型的 Hook 都是基于这个 Hook 类去继承而来的，同时这个基础的 Hook 类的实例也就是所谓的核心hook实例对象。
class Hook {
  constructor(args = [], name = undefined) {
    // 保存初始化Hook时传递的参数
    this._args = args;
    // name参数没什么用可以忽略掉
    this.name = name;
    // 保存通过tap注册的内容
    this.taps = [];
    // 保存拦截器相关内容 我们暂时先忽略拦截器
    this.interceptors = [];
    // hook.call 调用方法
    this._call = CALL_DELEGATE;
    this.call = CALL_DELEGATE;
    // _x存放hook中所有通过tap注册的函数
    this._x = undefined;
    // 动态编译方法
    this.compile = this.compile;
    // 相关注册方法
    this.tap = this.tap;

    // 与SyncHook无关的代码
    // this._callAsync = CALL_ASYNC_DELEGATE;
    // this.callAsync = CALL_ASYNC_DELEGATE;
    // this._promise = PROMISE_DELEGATE;
    // this.promise = PROMISE_DELEGATE;
    // this.tapAsync = this.tapAsync;
    // this.tapPromise = this.tapPromise;
  }
  /**
   * 所谓 compile 方法正是编译我们最终生成的执行函数的入口方法，同时我们可以看到在 Hook 类中并没有实现 compile 方法，
这是因为不同类型的 Hook 最终编译出的执行函数是不同的形式，所以这里以一种抽象方法的方式将 compile 方法交给了子类进行实现。
   * @param {*} options 
   */
  compile(options) {
    throw new Error("Abstract: should be overridden");
  }
}

module.exports = Hook;
