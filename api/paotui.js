/**
 * name: paotui.js
 * description: 跑腿服务器提供的服务
 * author: liuhd
 * date: 2018/11/19
 */
import request from './request.js'
class paotui {
  constructor() {
    // this._baseUrl = 'https://t.tiandaoedu.cn/api/'
    this._baseUrl = 'https://www.paotui.org/api/'
    this._defaultHeader = { 'Content-Type': 'application/json' }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 查询所有新闻列表
   */
  getNews(page = 1, size = 10) {
    let data = { page: page, size: size }
    return this._request.getRequest(this._baseUrl + 'news/client', data).then(res => res.data)
  }

  /**
   * 获取所有课程
   */
  getCourseList(page = 1, size = 10, key = null) {
    let data = key != null ? { page: page, size: size, queryValue: key } : { page: page, size: size }
    return this._request.getRequest(this._baseUrl + '/course/mobile', data).then(res => res.data)
  }
}
export default paotui