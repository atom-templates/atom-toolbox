# atom-cli

一个简单的atom项目工程的cli工具

### 安装

要求：node.js ( >= 4.x) npm version 3+ and Git

```
npm install -g atom-toolbox
```

### 使用


```
atom init <template-name> <project-name>
```
或者
```
atb init <template-name> <project-name>
```
或者
```
acli init <template-name> <project-name>
```

> 由于一些电脑上安装了atom的开发软件，再执行atom会调起开发软件，因此还支持 atb和acli，随意选择

举例

```
atom init webpack my-project
```
或者

```
atb init webpack my-project
```
或者
```
acli init webpack my-project
```

### 模板

目前的模板支持两种：webpack 和 fis3

- webpack - 使用webpack构建项目
- fis3  - 使用fis3构建项目
 
