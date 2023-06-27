const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { merge } = require("webpack-merge");
const prodConfig = require("./webpack.prod"); // 引入生产环境配置
const devConfig = require("./webpack.dev"); // 引入开发环境配置

// 公共配置
const commonConfig = {
  entry: "./src/axios.js", // 打包入口文件
  output: {
    filename: "axios.js", // 输出的文件名
    path: path.resolve(__dirname, "dist"), // 输出的绝对路径
    library: "axios", // 类库的命名空间，如果通过网页的方式引入，则可以通过window.axios访问它
    globalObject: "this", // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
    libraryTarget: "umd", // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
    libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
  },
  module: {
    rules: [
      // 配置 babel 的解析，同时在项目的跟目录下有.babelrc的babel配置文件
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 每次打包都先清理出口（dist）文件夹
  ],
};

module.exports = (env) => {
  // 根据执行命令判断开发环境or生产环境，启用不同的配置文件
  if (env && env.production) {
    return merge(commonConfig, prodConfig);
  } else {
    return merge(commonConfig, devConfig);
  }
};
