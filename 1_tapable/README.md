Tapable 源码中的核心正是围绕生成这两部分内容（一个是动态生成的 fn 、 一个是调用fn的 hook 实例对象）。
源码中分别存在两个 class 去管理这两块的内容：

Hook 类，负责创建管理上边的 hook 实例对象。下文简称这个对象为核心hook实例对象。
HookCodeFactory 类，负责根据内容编译最终需啊哟通过 hook 调用的 函数 fn 。下文简称这个函数为最终生成的执行函数。


这里我们创建了一个 index.js 作为项目入口文件

同时创建了一个 SyncHook.js 保存同步基本钩子相关逻辑。

同时创建 Hook.js ，该文件是所有类型 Hook 的父类，所有 Hook 都是基于该类派生而来的。

同时创建一个 HookCodeFactory.js 作为生成最终需要执行的函数的文件。
