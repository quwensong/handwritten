参考掘金链接----手写axios：https://juejin.cn/post/6914138611789070349

editorConfig ，有助于维护跨多个编辑器和 IDE 从事同一项目的多个开发人员的一致编码风格。
ESLint ，可组装的 JavaScript 和 JSX 检查工具。
husky ，git 命令 hook 专用配置，它可以配置执行 git commit 等命令执行的钩子。
lint-staged ，可以在特定的 git 阶段执行特定的命令。
prettier ，代码统一格式化。
commitlint ， git commit message 规范。

└──src
    └──axios.js // 入口文件
    └──core // 核心文件夹
        └──Axios.js // 存放 Axios 类
        └──dispatchRequest.js // 触发请求
        └──InterceptorManager.js // 拦截器
    └──adapters // 适配器文件夹，axios 可以适配 node 中的 http，浏览器中的 xhr
        └──xhr.js // 浏览器 xhr 请求
        └──http.js // node http 请求，目前暂未实现
    └──helpers // 存放工具函数
    	└──data.js // 转换数据相关函数
    	└──headers.js // 处理 header 相关函数
    	└──url.js // 处理 url 相关函数
    	└──util.js // 通用工具函数
