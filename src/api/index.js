// 导出一个配置好的axios提供给main挂载
import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint'

// 对axios进行配置
// baseURL 作用：设置基准地址（前面一段相同得地址）
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.transformResponse = [(data) => {
  // 后台原始数据 理想情况json字符串
  // 后台可能没有任何响应内容 data值是null
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 其他配置。。
// 配置请求头
// if (local.getUser()) {
//   axios.defaults.headers.Authorization = `Bearer ${local.getUser().token}`
// }

axios.interceptors.request.use(config => {
  // 1.获取token
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, err => {
  return Promise.reject(err)
})
axios.interceptors.response.use(res => res, err => {
  // 请求失败
  if (err.response.status === 401) {
    // 跳转登录页面
    // window.location.href = 'http://localhost:8080/#/login'
    // 使用vue-router来跳转，push是router实例的函数
    return router.push('/login')
  }
  return Promise.reject(err)
})
export default axios
