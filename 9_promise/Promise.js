// 参考链接: https://juejin.cn/post/7043758954496655397

class Promise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  // 构造器
  constructor(executor) {
    // 默认初始状态是pending
    this.PromiseState = Promise.PENDING;
    // 结果参数
    this.PromiseResult = null;
    //
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
    try {
      // 立即执行
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(result) {
    /**
     * 在执行resolve()的时候就需要判断状态是否为 待定 pending，如果是 待定 pending的话就把状态改为 成功 fulfilled:
     */

    if (this.PromiseState === Promise.PENDING) {
      this.PromiseState = Promise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach((callback) => callback());
    }
  }
  reject(reason) {
    if (this.PromiseState === Promise.PENDING) {
      this.PromiseState = Promise.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach((callback) => callback());
    }
  }
  then(onFulfilled, onRejected) {
    const promise2 = new Promise((resolve, reject) => {
      // 成功状态
      if (this.PromiseState === Promise.FULFILLED) {
        setTimeout(() => {
          //如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
          //如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值
          try {
            if (typeof onFulfilled !== "function") {
              resolve(this.PromiseResult);
            } else {
              const x = onFulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        });
        //失败状态
      } else if (this.PromiseState === Promise.REJECTED) {
        setTimeout(() => {
          try {
            // 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因
            if (typeof onRejected !== "function") {
              reject(this.PromiseResult);
            } else {
              const x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (error) {
            reject(error);
          }
        });
        //等待状态  如果执行then回调之前 状态还是pending，先把回调函数保存起来，等状态改变后再执行
      } else if (this.PromiseState === Promise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.PromiseResult);
              } else {
                const x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== "function") {
                reject(this.PromiseResult);
              } else {
                const x = onRejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }
  /**
   * catch() 方法返回一个Promise，并且处理拒绝的情况。
   * 它的行为与调用Promise.prototype.then(undefined, onRejected) 相同。
   * @param {*} onRejected
   * @returns
   */
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  /**
   * finally()
   * @param {*} callBack 无论结果是fulfilled或者是rejected，都会执行的回调函数
   * @returns
   */
  finally(callBack) {
    return this.then(callBack, callBack);
  }

  /**
   * Promise.resolve()
   * @param {[type]} value 要解析为 Promise 对象的值
   */
  static resolve(value) {
    // 如果这个值是一个 promise ，那么将返回这个 promise
    if (value instanceof Promise) {
      return value;
    } else if (value instanceof Object && "then" in value) {
      // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
      return new Promise((resolve, reject) => {
        value.then(resolve, reject);
      });
    }

    // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
    return new Promise((resolve) => {
      resolve(value);
    });
  }

  /**
   * Promise.reject
   * @param {*} reason 表示Promise被拒绝的原因
   * @returns
   */
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }

  /**
   * Promise.all
   * Promise.all() 方法接收一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入，并且只返回一个Promise实例， 输入的所有promise的resolve回调的结果是一个数组。
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static all(promises) {
    return new Promise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个已完成（already resolved）状态的 Promise
        if (promises.length === 0) {
          return resolve(promises);
        }

        promises.forEach((item, index) => {
          // Promise.resolve方法中已经判断了参数是否为promise与thenable对象，所以无需在该方法中再次判断
          Promise.resolve(item).then(
            (value) => {
              count;
              // 每个promise执行的结果存储在result中
              result[index] = value;
              // Promise.all 等待所有都完成（或第一个失败）
              count === promises.length && resolve(result);
            },
            (reason) => {
              /**
               * 如果传入的 promise 中有一个失败（rejected），
               * Promise.all 异步地将失败的那个结果给失败状态的回调函数，而不管其它 promise 是否完成
               */
              reject(reason);
            }
          );
        });
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }

  /**
   * Promise.allSettled() Promise.allSettled(iterable)方法返回一个在所有给定的promise都已经fulfilled或rejected后的promise，并带有一个对象数组，每个对象表示对应的promise结果。
   * @param {*} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static allSettled(promises) {
    return new Promise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let result = []; // 存储结果
        let count = 0; // 计数器

        // 如果传入的是一个空数组，那么就直接返回一个resolved的空数组promise对象
        if (promises.length === 0) return resolve(promises);

        promises.forEach((item, index) => {
          // 非promise值，通过Promise.resolve转换为promise进行统一处理
          Promise.resolve(item).then(
            (value) => {
              count;
              // 对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。
              result[index] = {
                status: "fulfilled",
                value,
              };
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              count === promises.length && resolve(result);
            },
            (reason) => {
              count;
              /**
               * 对于每个结果对象，都有一个 status 字符串。如果值为 rejected，则存在一个 reason 。
               * value（或 reason ）反映了每个 promise 决议（或拒绝）的值。
               */
              result[index] = {
                status: "rejected",
                reason,
              };
              // 所有给定的promise都已经fulfilled或rejected后,返回这个promise
              count === promises.length && resolve(result);
            }
          );
        });
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }

  /**
   * Promise.any()  接收一个Promise可迭代对象，只要其中的一个 promise 成功，就返回那个已经成功的 promise 。
   * @param {iterable} promises 一个promise的iterable类型（注：Array，Map，Set都属于ES6的iterable类型）的输入
   * @returns
   */
  static any(promises) {
    return new Promise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        let errors = []; //
        let count = 0; // 计数器

        // 如果传入的参数是一个空的可迭代对象，则返回一个 已失败（already rejected） 状态的 Promise。
        if (promises.length === 0)
          return reject(new AggregateError("All promises were rejected"));

        promises.forEach((item) => {
          // 非Promise值，通过Promise.resolve转换为Promise
          Promise.resolve(item).then(
            (value) => {
              // 只要其中的一个 promise 成功，就返回那个已经成功的 promise
              resolve(value);
            },
            (reason) => {
              cout;
              errors.push(reason);
              /**
               * 如果可迭代对象中没有一个 promise 成功，就返回一个失败的 promise 和AggregateError类型的实例，
               * AggregateError是 Error 的一个子类，用于把单一的错误集合在一起。
               */
              cout === promises.length && reject(new AggregateError(errors));
            }
          );
        });
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }

  /**
   * Promise.race()  方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
   * @param {iterable} promises 可迭代对象，类似Array。详见 iterable。
   * @returns
   */
  static race(promises) {
    return new Promise((resolve, reject) => {
      // 参数校验
      if (Array.isArray(promises)) {
        // 如果传入的迭代promises是空的，则返回的 promise 将永远等待。
        if (promises.length > 0) {
          promises.forEach((item) => {
            /**
             * 如果迭代包含一个或多个非承诺值和/或已解决/拒绝的承诺，
             * 则 Promise.race 将解析为迭代中找到的第一个值。
             */
            Promise.resolve(item).then(resolve, reject);
          });
        }
      } else {
        return reject(new TypeError("Argument is not iterable"));
      }
    });
  }
}

/**
 * 对resolve()、reject() 进行改造增强 针对resolve()和reject()中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled或onRejected的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  // 1.如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  /**
   * const promise = new Promise((resolve, reject) => {
        resolve(100)
    })
    const p1 = promise.then(value => {
        console.log(value)
        return p1
    })

   */
  if (x === promise2) {
    throw new TypeError("Chaining cycle detected for promise");
  }

  if (x instanceof Promise) {
    /**
     * 如果 x 为 Promise ，则使 promise2 接受 x 的状态
     * 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
     */
    x.then((y) => {
      resolvePromise(promise2, y, resolve, reject);
    }, reject);

    //  如果 x 不为对象或者函数，以 x 为参数执行 promise
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 2.3.3 如果 x 为对象或函数
    try {
      // 2.3.3.1 把 x.then 赋值给 then
      var then = x.then;
    } catch (e) {
      // 2.3.3.2 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      return reject(e);
    }

    /**
     * 2.3.3.3
     * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。
     * 传递两个回调函数作为参数，
     * 第一个参数叫做 `resolvePromise` ，第二个参数叫做 `rejectPromise`
     */
    if (typeof then === "function") {
      // 2.3.3.3.3 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      let called = false; // 避免多次调用
      try {
        then.call(
          x,
          // 2.3.3.3.1 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          // 2.3.3.3.2 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        /**
         * 2.3.3.3.4 如果调用 then 方法抛出了异常 e
         * 2.3.3.3.4.1 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
         */
        if (called) return;
        called = true;

        /**
         * 2.3.3.3.4.2 否则以 e 为据因拒绝 promise
         */
        reject(e);
      }
    } else {
      // 2.3.3.4 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  }
}

// 测试代码
console.log(1);
let promise1 = new Promise((resolve, reject) => {
  console.log(2);
  setTimeout(() => {
    console.log("A", promise1.PromiseState);
    resolve("这次一定");
    console.log("B", promise1.PromiseState);
    console.log(4);
  });
});
promise1.then(
  (result) => {
    console.log("C", promise1.PromiseState);
    console.log("fulfilled:", result);
  },
  (reason) => {
    console.log("rejected:", reason);
  }
);
console.log(3);
