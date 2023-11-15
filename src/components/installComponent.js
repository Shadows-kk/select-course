// 匹配当前目录下以及当前目录的子目录中的以.vue结尾的文件
const components = import.meta.glob("./**/*.vue");
// console.log(components)
// console.log(Object.entries(components))

/**
 * 全局组件引用管理
 */
export default {
  install(app) {
    for (let [key, value] of Object.entries(components)) {
      let name = key.slice(key.lastIndexOf("/") + 1, key.lastIndexOf("."));
      app.component(name, value);
    }      
  }
}