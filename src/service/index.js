import Request from "./request";
import { BASE_URL, TIME_OUT } from "./request/config";
import localCache from "@/plugins/cache";
import { ElMessage } from "element-plus";
import router from "@/router/index.js";

let flag = true;
const eRequest = new Request({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptors: (config) => {
      // console.log(config.url.split('/')[1])
      // 给实例添加的token
      const token = localCache.getCache("HDToken");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    requestInterceptorsCatch: (err) => {
      return err;
    },
    responseInterceptors: (config) => {
      console.log(config);
      if (config.status === 200) {
        return config;
      } else {
        ElMessage.error(config.data.errorMsg);
        return;
      }
    },
    responseInterceptorsCatch: (error) => {
      console.log("报错", error.response, error.message);
      return Promise.reject(error)
        .then()
        .catch((res) => {
          if (error.response.status == 401) {
            /*
             * 如果登录时间过长 则检测超时状态码401
             * 清空本地local存储 并且跳转回
             * */
            if (flag) {
              ElMessage.error({
                message: "登录过期请重新登录",
                center: true,
                showClose: true,
                duration: 2000,
                onClose: () => {
                  localCache.clearCache(); // 清空本地缓存
                  // location.reload(); // 返回登录页时强制刷新
                  router.push({ path: "/login" });
                },
              });
              flag = false;
            }
            setTimeout(() => {
              flag = true;
            }, 3000);
          } else {
            var options = {
              message: error.response.status + ":" + error.response.statusText,
              center: true,
            };
            ElMessage.error(options);
          }
        });
    },
  },
});
export default eRequest;
