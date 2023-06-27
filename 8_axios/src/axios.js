class Axios {
  // 用来存储配置信息。
  config = {};
  constructor(initConfig) {
    // 实例化时接收一个配置信息，并保存到config属性中。
    this.config = initConfig;
  }
  // 该类有一个 request 方法，它可以用来发送请求
  request(config) {}
}

console.log(Axios);
