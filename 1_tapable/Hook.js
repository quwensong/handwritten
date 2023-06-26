// 我们先来看看 Hook 父类对象，所有类型的 Hook 都是基于这个 Hook 类去继承而来的，同时这个基础的 Hook 类的实例也就是所谓的核心hook实例对象。
/**
 * this.call 方法最开始指向的是 CALL_DELEGATE 方法。
CALL_DELEGATE 方法内部通过 this._createCall("sync") 编译生成最终生成的执行函数。
从而将生成的函数赋值给  this.call ,在通过 this.call(...args) 调用最终生成的执行函数。
 */
const CALL_DELEGATE = function (...args) {
  this.call = this._createCall("sync");
  return this.call(...args);
};

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

  tap(options, fn) {
    // 这里额外多做了一层封装 是因为this._tap是一个通用方法
    // 这里我们使用的是同步 所以第一参数表示类型传入 sync
    // 如果是异步同理为sync、promise同理为 promise 这样就很好的区分了三种注册方式
    this._tap("sync", options, fn);
  }
  /**
   *我们可以看到 Hook 类上的原型方法 tap 接受的第二个参数，不仅仅是一个字符串同时也可以传递一个对象。比如:
   hook.tap({
    name: 'flag1'
    }, (arg) => {
        // dosomething
    })
    同时 tap() 方法第一个参数支持传入 string/object ，当传入 object 类型时支持 before、stage 属性，这里 before/state 属性的处理源码中是在 _inset 方法中，这里我们先忽略它，后续我会带你补充这部分逻辑。
   * @param {*} type 注册的类型 promise、async、sync
   * @param {*} options 注册时传递的第一个参数对象
   * @param {*} fn 注册时传入监听的事件函数
   */
  _tap(type, options, fn) {
    if (typeof options === "string") {
      options = {
        name: options.trim(),
      };
    } else if (typeof options !== "object" || options === null) {
      // 如果非对象或者传入null
      throw new Error("Invalid tap options");
    }
    // 那么此时剩下的options类型仅仅就只有object类型了
    if (typeof options.name !== "string" || options.name === "") {
      // 如果传入的options.name 不是字符串 或者是 空串
      throw new Error("Missing name for tap");
    }
    // 合并参数 { type, fn,  name:'xxx'  }
    options = Object.assign({ type, fn }, options);
    // 将合并后的参数插入
    this._insert(options);
  }
  /**
   * 当我们通过 hooks.tap 注册方法时每次都会触发 _insert 方法，故而我们在 _insert 方法中每次都重置  this.call 方法为编译方法 CALL_DELEGATE 。
    此时每次调用 tap 方法注册函数都会重置 this.call 方法。
   */
  // 每次tap都会调用 _resetCompilation 重新赋值 this.call
  _resetCompilation() {
    this.call = this._call;
  }
  _insert(item) {
    // _resetCompilation 会在后边和大家结合实际补充逻辑
    this._resetCompilation(); 
    this.taps.push(item);
  }
  /**
   * 编译最终生成的执行函数的方法 compile是一个抽象方法 需要在继承Hook类的子类方法中进行实现
   * @param {*} type
   * @returns
   */
  _createCall(type) {
    return this.compile({
      taps: this.taps,
      // interceptors: this.interceptors, 先忽略拦截器
      args: this._args,
      type: type,
    });
  }
}

module.exports = Hook;
