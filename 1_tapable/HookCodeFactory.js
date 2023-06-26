class HookCodeFactory {
  constructor(config) {
    this.config = config;
    this.options = undefined;
    this._args = undefined;
  }

  /**
   * 初始化参数 setup 方法的实现非常简单，它的作用是用来初始化当前事件组成的集合。
   * 我们在每次调用 hook.call 时会首先通过 setup 方法为 hook 实例对象上的 _x 赋值为所有被 tap 注册的事件函数 [fn1,fn2 ...]。
   * @param {*} instance COMPILE 方法中的 this 对象，也就是我们通过 new Hook 生成的 hook 实例对象
   * @param {*} options 调用 COMPILE 方法时 Hook 类上 _createCall 传递的 options 对象， 它的内容是:
   * {
			taps: this.taps,
			interceptors: this.interceptors,
			args: this._args,
			type: type
		}
   */
  setup(instance, options) {
    instance._x = options.taps.map((i) => i.fn);
  }

  // 编译最终需要生成的函数
  /**
   * 正是通过 HookCodeFactory 类上的 create 方法编译出的这段函数 :
   * function fn(arg1, arg2) {
    "use strict";
    var _context;
    var _x = this._x;
    var _fn0 = _x[0];
    _fn0(arg1, arg2);
    var _fn1 = _x[1];
    _fn1(arg1, arg2);
    }
    这里，我们在  HookCodeFactory 类上创建了一个一个 create 方法，这个方法宏观上来说有三个方面 :
    1.this.init() ，每次编译时首先初始化相关的属性。
    2.switch 方法中会匹配不同类型的 hook 进行相关编译处理，这里你可以先忽略具体的编译逻辑。
    3.this.deinit() ,当已经编译完成结果赋值给 fn 时，此时我们需要解除相关参数的赋值。
    
    在 switch 语句中，我们通过 new Function 动态构建最终需要执行的函数，接下里我逐步实现 switch 语句中的逻辑。
   * @param {*} options 
   */
  create(options) {
    this.init(options);
    // 最终编译生成的方法 fn
    let fn;
    switch (this.options.type) {
      case "sync":
        fn = new Function(
          this.args(),
          '"use strict";\n' +
            this.header() +
            this.contentWithInterceptors({
              onError: (err) => `throw ${err};\n`,
              onResult: (result) => `return ${result};\n`,
              resultReturns: true,
              onDone: () => "",
              rethrowIfPossible: true,
            })
        );
        break;
      // 其他类型先不考虑
      default:
        break;
    }
    this.deinit();
    return fn;
  }
  /**
   * @param {{ type: "sync" | "promise" | "async", taps: Array<Tap>, interceptors: Array<Interceptor> }} options
   */
  init(options) {
    this.options = options;
    // 保存初始化Hook时的参数
    this._args = options.args.slice();
  }

  deinit() {
    this.options = undefined;
    this._args = undefined;
  }
  /**
   * args 方法其实非常简单，它的作用就是将保存在类中的 this._args 数组转化称为字符串从而传递给对应的 new Function 语句。
   * @param {*} param0
   * @returns
   */
  args({ before, after } = {}) {
    let allArgs = this._args;
    if (before) allArgs = [before].concat(allArgs);
    if (after) allArgs = allArgs.concat(after);
    if (allArgs.length === 0) {
      return "";
    } else {
      return allArgs.join(", ");
    }
  }

  /**
   * 这样一下子就清晰了很多，通过 this.header 方法 Tapable 会生成一段这样的字符串:
    var _context;
    var _x = this._x
   * @returns 
   */
  header() {
    let code = "";
    code += "var _context;\n";
    code += "var _x = this._x;\n";
    return code;
  }
  /**
   * this.contentWithInterceptors 人如其名，生成函数内容和拦截器内容。涉及拦截器的部分我们将它忽略掉，来看看这个精简后的方法:
   * @param {*} options
   * @returns
   */
  contentWithInterceptors(options) {
    // 如果存在拦截器
    if (this.options.interceptors.length > 0) {
      // ...
    } else {
      return this.content(options);
    }
  }

  // 根据this._x生成整体函数内容
  callTapsSeries({ onDone }) {
    let code = "";
    let current = onDone;
    // 没有注册的事件则直接返回
    if (this.options.taps.length === 0) return onDone();
    // 遍历taps注册的函数 编译生成需要执行的函数
    for (let i = this.options.taps.length - 1; i >= 0; i--) {
      const done = current;
      // 一个一个创建对应的函数调用
      const content = this.callTap(i, {
        onDone: done,
      });
      current = () => content;
    }
    code += current();
    return code;
  }

  // 编译生成单个的事件函数并且调用 比如 fn1 = this._x[0]; fn1(...args)
  callTap(tapIndex, { onDone }) {
    let code = "";
    // 无论什么类型的都要通过下标先获得内容
    // 比如这一步生成 var _fn[1] = this._x[1]
    code += `var _fn${tapIndex} = ${this.getTapFn(tapIndex)};\n`;
    // 不同类型的调用方式不同
    // 生成调用代码 fn1(arg1,arg2,...)
    const tap = this.options.taps[tapIndex];
    switch (tap.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});\n`;
        break;
      // 其他类型不考虑
      default:
        break;
    }
    if (onDone) {
      code += onDone();
    }
    return code;
  }

  // 从this._x中获取函数内容 this._x[index]
  getTapFn(idx) {
    return `_x[${idx}]`;
  }
}

module.exports = HookCodeFactory;
