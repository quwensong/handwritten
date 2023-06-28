const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development", // 开发环境
  devtool: "cheap-module-eval-source-map", // sourceMap用于错误调试
  devServer: {
    contentBase: "./public", // 服务器启动根目录设置为public
    open: true, // 自动打开浏览器
    port: 8088, // 端口号
    hot: true, // 开启热更新，同时要配置相应的插件HotModuleReplacementPlugin
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html", // 使用模板文件，主要用于查看效果
      inject: "head", // 插入到 head 标签中
    }),
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
  ],
};
