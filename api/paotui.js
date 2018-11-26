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
    this._baseUrl = 'http://www.paotui.org/api/'
    this._defaultHeader = { 'content-type': 'application/x-www-form-urlencoded' }
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
   * 根据用户id和订单状态查询订单列表
   */
  getOrderList(uid, status) {
    let data = { uid: uid, order_status: status }
    return this._request.postRequest(this._baseUrl + 'buyOrder/order_list', data, this._defaultHeader).then(res => res.data);
  }

  /**
   * 获取所有课程
   */
  getCourseList(page = 1, size = 10, key = null) {
    let data = key != null ? { page: page, size: size, queryValue: key } : { page: page, size: size }
    return this._request.getRequest(this._baseUrl + '/course/mobile', data).then(res => res.data).catch(res=>res.data)
  }
}
export default paotui