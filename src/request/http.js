// 首先导入 axios
import axios from 'axios'
import { message } from 'ant-design-vue';
import router from '../router'

// 创建一个axios对象
const request = axios.create({
    baseURL: '/api-kettle/',   // 基础路径，会自动添加到你请求url前面
    //baseURL: '/api/',   // 基础路径，会自动添加到你请求url前面
    timeout: 10000   // 请求超时，10000毫秒
})

//request.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

//http request 拦截器
request.interceptors.request.use(
    config => {
        //config.data = JSON.stringify(config.data);
        config.headers = {
            'Content-Type': 'application/json;charset=utf-8',
            //'Access-Control-Allow-Origin': 'http://localhost:6989',
            //'Access-Control-Allow-Credentials': 'true',
            'Authorization': "Bearer " + sessionStorage.getItem('Authorization')
        }
        return config;
    },
    error => {
        message.error("网络链接异常", 3);
        console.log(Promise.resolve(error))
        return false;
    }
);

// 相应拦截器
request.interceptors.response.use(response => {
    // 在2xx范围内的任何状态代码都会触发此功能
    // 处理响应数据
    let flag = false;
    switch (response.data.statusCode) {
        case "00000":
            message.success(response.data.msg, 3)
            if (null == response.data.data) {
                response.data.data = true;
            }
            break;
        case "A0230":
            flag = true;
            break;
        case "A0220":
            flag = true;
            break;
        case "A0320":
            flag = true;
            break;
        default:
            message.error(response.data.msg, 3)
            response.data.data = false;
    }
    if (flag) {
        message.error(response.data.msg, 3)
        sessionStorage.clear();
        router.push("/login");
        return false;
    }
    if (response.headers.authorization != null) {
        sessionStorage.setItem('Authorization', response.headers.authorization)
    }
    return response.data.data;
}, error => {
    // 任何超出2xx范围的状态代码都会触发此功能
    // 处理响应错误
    message.error("异常", 3);
    console.log(Promise.resolve(error));
    return false;
});




export default request  // 导出自定义创建的 axios 对象