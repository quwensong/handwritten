module.exports = {
  env: {
    // env 关键字指定你想启用的环境
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "babel-eslint", // 解析器
  extends: "eslint:recommended", // 继承的配置规则集
  parserOptions: {
    ecmaVersion: 12, // 指定你想要使用的 ECMAScript 版本
    sourceType: "module", // 启用 ESModule
  },
  rules: {
    // 规则 "off" = 关闭 "warn" = 警告 "error" = 报错
    strict: "off", // 严格模式，规则关闭
    "no-console": "off", // 禁用 console 对象方法，规则关闭
    "global-require": "off", // 要求 require() 出现在顶层模块作用域中，规则关闭
    "require-yield": "off", // 要求 generator 函数内有 yield，规则关闭
  },
};
