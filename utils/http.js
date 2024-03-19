import APIConfig from "../config/api"
import exceptionMessage from "../config/exception-message";
import { wxToPromise } from "./wx";

class Http {
  static async request({url,data,method='GET'}){

    const res = await wxToPromise("request", { url: APIConfig.baseUrl + url, data, method });

    // 全局的统一响应、异常处理
    const statusCode = res.statusCode
    if (statusCode < 400) {
      return res.data.data
    }
    // TODO 请求失败
    if(statusCode === 401){
      // TODO 令牌相关操作
      return
    }
    Http._showError(res.data.error_code,res.data.message)
    // 接口错误信息，一定要看清楚文档，哪些适合直接展示出去，哪些不适合直接展示出去
  }

  // 错误信息展示
  static _showError(errorCode,message){
    let title = ''
    const errorMessage = exceptionMessage[errorCode]
    title = errorMessage || message || '未知异常'

    title = typeof title === 'object' ? Object.values(title).join(';') : title
    wx.showToast({
      title,
      icon: 'none',
      duration:3000
    })
  }
}

export default Http