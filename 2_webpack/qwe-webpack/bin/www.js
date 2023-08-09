#! /usr/bin/env node
// 表示用当前用户的node环境来执行这个脚本

// 1.拿到使用当前包的项目(test) 的配置文件路径 webpack.config.js
const path = require('path');
const configPath = path.resolve('webpack.config.js'); //D:\前端学习learn\Vue学习之路\webpack\test\webpack.config.js

// 2.自动引用webpack.config.js配置文件导出的那个配置对象
const config = require(configPath);

// 3.通过配置文件进行打包
const Compiler = require('../src/compiler');

// 4.实例化打包器
const compiler = new Compiler(config)
if(Array.isArray(config.plugins)){
  config.plugins.forEach(plugin => {
    // 如果有插件对象，就执行对象上面的apply方法并且把compiler传过去
    plugin.apply(compiler)
  })
}
config.plugins.forEac
compiler.hooks.entryOption.call();
// 5.开始打包
compiler.run()




(function(modules) {
  // modules传入的模块定义：{ moduleId: moduleFunc(module, exports) {} }
  // 模块加载缓存
    var installedModules = {};
      // webpack 自定义的 require 函数，用来加载模块，最终导出加载的模块内容
    function __webpack_require__(moduleId) {
      // 检查缓存中是否存在需要加载的模块
      // 存在就返回exports，exports 既是模块内容
      if(installedModules[moduleId]) {
        return installedModules[moduleId].exports;
      }
        // 新建一个模块，并存入缓存
      var module = installedModules[moduleId] = {
        i: moduleId,// 模块ID 也就是路径
        l: false,// 是否已加载过
        exports: {} // exports 对象，初始化为一个空对象
      };
        // 加载模块对应的函数 moduleFunc(module, exports) {}
      modules[moduleId].call(
        module.exports,// 初始化this为一个空对象，这就是模块具有自身作用域的实现
        module, // 需要加载的模块
        module.exports,// 模块的exports
        __webpack_require__ // webpack的require方法，用来替换CommonJS的require
      );
      // 标注该模块已经加载
      module.l = true;
        // 返回模块的导出  module.exports 就是 modules[./src/main.js] 对应的函数。
      return module.exports;
    }
      // 加载模块并返回模块内容
    return __webpack_require__("<%=entryName%>");
  })
  ({
    './src/index.js': (function(module,exports, __webpack_require__) {
        eval("const main = __webpack_require__(/*! ./main.js */ \"./src/main.js\")\r\nconsole.log('test webpack entry')\r\n\n\n//# sourceURL=webpack:///./src/index.js?");
    }), 
    './src/main.js': (function(module, exports) {
        eval("console.log('main module')\n\n//# sourceURL=webpack:///./src/main.js?");
    })
})