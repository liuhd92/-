/**
 * name: paotui.js
 * description: 跑腿服务器提供的服务
 * author: liuhd
 * date: 2018/11/19
 */
import request from './request.js'
class paotui {
  constructor() {
    this._baseUrl = 'https://t.tiandaoedu.cn/api/'
    // this._baseUrl = 'http://www.paotui.org/api/'
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
   * 获取订单详细信息
   */
  getOrderDetail(id) {
    let data = { id: id }
    return this._request.postRequest(this._baseUrl + 'order/order_detail', data, this._defaultHeader).then(res => res.data);
  }

  /**
   * 修改订单状态
   */
  changeOrderStatus(id, status) {
    let data = { id: id, order_status: status }
    console.log(data)
    return this._request.postRequest(this._baseUrl + 'order/update_status', data, this._defaultHeader).then(res => res.data);
  }

  /**
   * 取送件商品信息
   */
  getGoodsList(type) {
    let data = { type: type }
    return this._request.postRequest(this._baseUrl +'goods/goods_list', data, this._defaultHeader).then(res => res.data);
  }

  /**
   * 用户登录
   */
  userLogin(code) {
    console.log('code : '+code)
    let data = { code: code}
    return this._request.postRequest(this._baseUrl + 'WeChat/getopenId', data, this._defaultHeader).then(res => res.data);
  }

  /**
   * 用户授权手机号
   */
  getPhoneNumber(encryptedData, iv, session_key, openid) {
    let data = { encryptedData: encryptedData, iv: iv, session_key: session_key, openid }
    console.log('data : ')
    console.log(data)
    return this._request.postRequest(this._baseUrl + 'WeChat/getPhoneNumber', data, this._defaultHeader).then(res => res.data);
  }

  /**
   * 用户下单
   */
  createOrder(param) {
    let data = param;
    return this._request.postRequest(this._baseUrl + 'buyOrder/buy_order', data, this._defaultHeader).then(res => res.data)
  }

  /**
   * 订单评价
   */
  order_comment(param) {
    let data = param;
    return this._request.postRequest(this._baseUrl + 'order/order_comment', data, this._defaultHeader).then(res => res.data)
  }

  /**
   * 意见反馈
   */
  miniFeedback(uid, content, phone) {
    let data = { uid: uid, content: content, phone: phone };
    return this._request.postRequest(this._baseUrl + 'public/mini_feedback', data, this._defaultHeader).then(res => res.data)
  }

  /**
   * 预支付
   */
  wxPreparePay(param) {
    let data = param;
    return this._request.postRequest(this._baseUrl + 'wxpay/prepay', data, this._defaultHeader).then(res => res.data)
  }

  /**
   * 支付
   */
  wxPay(prepay_id) {
    let data = { prepay_id: prepay_id };
    return this._request.postRequest(this._baseUrl + 'wxpay/pay', data, this._defaultHeader).then(res => res.data)
  }

  /**
   * 获取所有课程
   */
  // getCourseList(page = 1, size = 10, key = null) {
  //   let data = key != null ? { page: page, size: size, queryValue: key } : { page: page, size: size }
  //   return this._request.getRequest(this._baseUrl + '/course/mobile', data).then(res => res.data).catch(res=>res.data)
  // }
}
export default paotui