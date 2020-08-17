import { resolve } from 'path'
import { Configuration } from 'webpack'
import WebpackBar from 'webpackbar'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'
// import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
// import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
// eslint-disable-next-line import/no-unresolved
import { loader as MiniCssExtractLoader } from 'mini-css-extract-plugin'

import { __DEV__, PROJECT_ROOT, HMR_PATH } from '../utils/constants'

function getCssLoaders(importLoaders: number) {
  return [
    __DEV__ ? 'style-loader' : MiniCssExtractLoader,
    {
      loader: 'css-loader',
      options: {
        modules: false,
        // 前面使用的每一个 loader 都需要指定 sourceMap 选项
        sourceMap: true,
        // 指定在 css-loader 前应用的 loader 的数量
        importLoaders,
      },
    },
    {
      loader: 'postcss-loader',
      options: { sourceMap: true },
    },
  ]
}

const commonConfig: Configuration = {
  cache: true,
  context: PROJECT_ROOT,
  entry: ['react-hot-loader/patch', resolve(PROJECT_ROOT, './src/index.tsx')],
  resolve: {
    // 我们导入ts 等模块一般不写后缀名，webpack 会尝试使用这个数组提供的后缀名去导入
    extensions: ['.js', '.tsx', '.ts', '.json'],
    alias: {
      // 替换 react-dom 成 @hot-loader/react-dom 以支持 react hooks 的 hot reload
      'react-dom': '@hot-loader/react-dom',
      '@': resolve(PROJECT_ROOT, './src'),
    },
  },
  plugins: [
    new WebpackBar({
      name: 'create-react-ts-webpack-npm-package',
      color: 'green',
    }),
    new FriendlyErrorsPlugin(),
    // new WebpackBuildNotifierPlugin({ suppressSuccess: true }),
    // new CaseSensitivePathsPlugin(),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: getCssLoaders(0),
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(2),
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        use: [
          {
            loader: 'url-loader',
            options: {
              // 低于 10 k 转换成 base64
              limit: 10 * 1024,
              // 在文件名中插入文件内容 hash，解决强缓存立即更新的问题
              name: '[name].[contenthash].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name]-[contenthash].[ext]',
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
}

if (__DEV__) {
  // 开发环境下注入热更新补丁
  // reload=true 设置 webpack 无法热更新时刷新整个页面，overlay=true 设置编译出错时在网页中显示出错信息遮罩
  ;(commonConfig.entry as string[]).unshift(
    `webpack-hot-middleware/client?path=${HMR_PATH}&reload=true&overlay=true`,
  )
}

export default commonConfig
