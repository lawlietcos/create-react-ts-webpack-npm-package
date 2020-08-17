import { resolve } from 'path'
import { merge } from 'webpack-merge'
import { HotModuleReplacementPlugin } from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { Options as HtmlMinifierOptions } from 'html-minifier'

import commonConfig from './webpack.common'
import { PROJECT_ROOT, __DEV__, PROJECT_NAME } from '../utils/constants'

// index.html 压缩选项
const htmlMinifyOptions: HtmlMinifierOptions = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  useShortDoctype: true,
}

const devConfig = merge(commonConfig, {
  mode: 'development',
  // 如果觉得还可以容忍更慢的非 eval 类型的 sourceMap，可以搭配 error-overlay-webpack-plugin 使用
  // 需要显示列号可以切换成 eval-source-map
  output: {
    publicPath: '/',
    path: resolve(PROJECT_ROOT, './dist'),
    filename: 'js/[name]-[hash].bundle.js',
    hashSalt: PROJECT_NAME,
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 1024,
        configFile: resolve(PROJECT_ROOT, './src/tsconfig.json'),
      },
    }),
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // HtmlWebpackPlugin 会调用 HtmlMinifier 对 HTMl 文件进行压缩
      // 只在生产环境压缩
      minify: __DEV__ ? false : htmlMinifyOptions,
      template: resolve(PROJECT_ROOT, './public/index.html'),
      templateParameters: (...args: any[]) => {
        const [compilation, assets, assetTags, options] = args
        const rawPublicPath = commonConfig.output!.publicPath!
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options,
          },
          // 在 index.html 模板中注入模板参数 PUBLIC_PATH
          // 移除最后的反斜杠为了让拼接路径更自然，例如：<%= `${PUBLIC_PATH}/favicon.ico` %>
          PUBLIC_PATH: rawPublicPath.endsWith('/') ? rawPublicPath.slice(0, -1) : rawPublicPath,
        }
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: resolve(PROJECT_ROOT, './public'),
          from: '*',
          to: resolve(PROJECT_ROOT, './dist'),
          toType: 'dir',
          globOptions: {
            ignore: ['index.html'],
          },
        },
      ],
    }),
  ],
})

export default devConfig
