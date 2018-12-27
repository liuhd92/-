// pages/yijianfk/yijianfk.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'content': '',
    'phone': ''
  },

  /**
   * 提交反馈信息
   */
  submitFeedback: function(e) {
    var content = this.data.content;
    var phone = this.data.phone;

    if (content.length < 5) {
      wx.showToast({
        title: '反馈内容应大于5个字！',
        icon: 'none'
      })
      return false;
    }

    if (phone != '' && phone.length != 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return false;
    }
    
    app.paotui.miniFeedback(wx.getStorageSync('user_id'), content, phone)
      .then(res => {
        console.log('反馈成功')
        console.log(res)
      })
      .catch(res => {
        console.log('反馈失败')
        console.log(res)
      })
  },

  /**
   * 获取反馈内容
   */
  getFeedbackContent: function(e) {
    var content = e.detail.value;
    if (content != '') {
      this.setData({
        'content': content
      })
    }    
  },

  /**
   * 获取意见反馈手机号
   */
  getFeedbackPhone: function(e) {
    var phone = e.detail.value;
    if (phone != '') {
      this.setData({
        'phone': phone
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})