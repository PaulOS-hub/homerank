import axios from 'axios'
import qs from 'qs'
import { BASE_URL, TIMEOUT } from '../../config'
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = BASE_URL;  // dev BASE_URL
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.interceptors.request.use(config => {
    // 1.发送网络请求时候,在界面的中间位置显示loading组件
    // 2.某一些请求用户必须携带TOKEN,如果没有携带，那么直接跳转到登陆页面
    // 3.params/data序列化的操作,qs.stringfly
    return config
}, err => {

})

axios.interceptors.response.use(res => {
    return res.data
}, err => {
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                console.log('请求错误')
                break;
            case 401:
                console.log('未授权访问')
                break
            default:
                console.log('其他错误信息')
        }
    }
    return err
})
export function get(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: param }).then(response => {
            resolve(response)
        }, err => {
            reject(err)
        }).catch((error) => {
            reject(error)
        })
    })
}

export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(params)).then(response => {
            resolve(response);
        }, err => {
            reject(err);
        }).catch((error) => {
            reject(error)
        })
    })
}
