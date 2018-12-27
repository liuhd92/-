// pages/personSet/personSet.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: app.golablData.userInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList();
  },

  // 获取订单列表
  getOrderList: function (e) {
    app.paotui.getOrderList(1, 0)
      .then(res => {
        console.log('订单列表获取成功');
        console.log(res);
      })
      .catch(res => {
        console.log('订单列表获取失败');
        console.log(res);
      })
  },

  // 跳转到订单页面
  jumpToOrderList: function(){
    wx.navigateTo({
      url: '../orderList/orderList',
    })
  },

  phoneNumber:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.kf_phone,
      success: function (res) {
        console.log(res);
      }
    })
  },
 
  yijianfk: function (e) {
    wx.navigateTo({
      url: '/pages/yijianfk/yijianfk'
    })
  },
  clickSz:function(e){
    wx.navigateTo({
      url: '/pages/clickSz/clickSz'
    })
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