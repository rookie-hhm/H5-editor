const path = require('path')

const resolve = targePath => {
  return path.resolve(__dirname, targePath)
}

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局配置scss的mixin
        prependData: `
          @import "~@/style/mixin.scss";
        `
      }
    }
  },
  chainWebpack (config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
