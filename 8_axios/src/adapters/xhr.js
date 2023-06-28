module.exports = function xhr(config) {
  // 解构config，data 如果不传默认为null，method 不传默认为 get方法，url是必传参数
  const { data = null, url, method = "get" } = config;
  // 实例化 XMLHttpRequest
  const request = new XMLHttpRequest();
  // 初始化一个请求
  request.open(method.toUpperCase(), url, true);
  // 发送请求
  request.send(data);
};
