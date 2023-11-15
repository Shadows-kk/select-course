import axios from "axios";
class Request {
  constructor(config) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;

    // 1.给每一个实例对象添加自定义的拦截器，从config中取出的是实例的拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptors,
      this.interceptors?.responseInterceptorsCatch
    );
    // 2.添加共有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        const data = res?.data;
        if (data?.returnCode === "-1001") {
          console.log("请求失败");
        } else {
          return data;
        }
      },
      (err) => {
        if (err.response.status === 404) {
          console.log("404错误");
        }
        return err;
      }
    );
  }
  request(config) {
    return new Promise((resolve, reject) => {
      // 3.添加每个请求自己的拦截器
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config);
      }
      this.instance.request(config).then((res) => {
        if (config.interceptors?.responseInterceptors) {
          res = config.interceptors.responseInterceptors(res);
        }
        resolve(res);
      });
    });
  }
  get(config) {
    return this.request({ ...config, method: "GET" });
  }
  post(config) {
    return this.request({ ...config, method: "POST" });
  }
  put(config) {
    return this.request({ ...config, method: "PUT" });
  }
  delete(config) {
    return this.request({ ...config, method: "DELETE" });
  }
  patch(config) {
    return this.request({ ...config, method: "PATCH" });
  }
}
export default Request;
