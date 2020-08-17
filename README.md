<div align="center">

# create-react-ts-webpack-npm-package

</div>

使用 webpack 打包 react+typescript 的 npm 包

## 特性

- 使用 typescript 进行开发
- 使用 postcss 同时兼容 less scss 处理
- 使用 prettier 统一格式化代码
- 采用 webapck 构建
- 使用 precommit 钩子自动 Lint、格式化代码

## 构建与发布说明

### 安装

进入到项目根目录，安装依赖。（自动安装子项目依赖）

```
yarn install
```

### 开发

```
yarn start
```

### 发布

1. 首先打包

```
yarn build
```

2. 构建且发布到 npm 镜像

```
yarn publish
```

## 开发说明

1. index.tsx 文件可以作为发布的出口，注意发布时要注释掉 render 部分， render 部分只作为开发时的依赖

### 參考

- [从零开始配置 react + typescript（三）：webpack](https://lyreal666.com/从零开始配置-react-typescript（三）：webpack/)
-
