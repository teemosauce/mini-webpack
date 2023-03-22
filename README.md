# 用一个简单的示例 剖析Webpack打包的基本原理

npm install

npm run build


# 开发依赖包
- babylon 主要功能把源码转成抽象语法树 类似的库可以参考[https://astexplorer.net/]
- babel-traverse 对抽象语法树进行遍历
- babel-core 对JS代码进行转换，让代码能够在浏览器环境中运行 比如ejs -> cjs的转换
- babel-preset-env babel需要的插件 babel需要不同的preset以支持各种语法的转化
- babel-preset-es2015 babel需要的插件

