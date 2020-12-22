import axios from "axios";
import {Message, MessageBox} from "element-ui";
import store from '../stroe'
import {removeToken} from "@/utils/auth";


// 跨域携带session
axios.defaults.withCredentials = true;

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 115000 // request timeout
});

// http response 服务器响应拦截器，这里拦截错误及登陆失效
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 20000) {
      if (res.code === 50004) {
        removeToken();
        MessageBox.alert('你的登录状态已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload();
            sessionStorage.clear(); // 清空sessionStorage
          })
        })

        return Promise.resolve(response);
      }
      if (res.code === 50005 || res.code === 55000 || res.code === 40001) {
        if (res.message) {
          Message({
            message: res.message,
            type: "error",
            duration: 5 * 1000
          });
        }
        return Promise.reject(res.message);
      }
    } else {
      return Promise.resolve(response);
    }
  },
  error => {
    console.log(error)
    return Promise.reject(error);
  }
);

export default service;
