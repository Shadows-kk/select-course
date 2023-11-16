import * as globalFns from '@/utils/index.js'
export default function registerFcns(app) {
  // 工具函数
  Object.keys(globalFns).forEach((fn) => {
    // app.config.globalProperties定义全局的方法或者属性
    app.config.globalProperties[`$${fn}`] = globalFns[fn]
  })
}