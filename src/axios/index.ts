import axios from "axios"
import store from "@/store/index";



// 请求拦截器
/*axios.interceptors.request.use(
  req => {
    const token = sessionStorage.getItem("token");
    if (token != null) {
      req.headers.token = token;
    }
    return req;
  },
  error => {
    return Promise.reject(error);
  }
);*/

// 响应拦截器
/*axios.interceptors.response.use(
  resp => resp,
  error => {
    let resp = error.response;
    if (resp) {
      switch (resp.status) {
        case 401:
          // 可基于响应码，声明单独的处理
          break;
      }
      // 此时为同步事件，统一将任意异常信息，置于store
      store.commit(GET_EXCEPTION, { message: resp.data.message });
    }
    // 可以阻止调用方法继续执行。但控制台有异常信息
    return Promise.reject();
  }
);*/

export default axios;