declare module 'speed-measure-webpack-plugin' {
  import { Configuration, Plugin } from 'webpack'

  interface SpeedMeasurePluginOptions {
    disable: boolean
    outputFormat: 'json' | 'human' | 'humanVerbose' | ((outputObj: Record<string, unknown>) => void)
    outputTarget: string | ((outputObj: string) => void)
    pluginNames: Record<string, unknown>
    granularLoaderData: boolean
  }

  class SpeedMeasurePlugin extends Plugin {
    constructor(options?: Partial<SpeedMeasurePluginOptions>)
    wrap(webpackConfig: Configuration): Configuration
  }

  export = SpeedMeasurePlugin
}
