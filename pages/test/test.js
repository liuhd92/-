// pages/test/test.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone_status: getApp().globalData.phone_status
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    console.log(getApp().globalData.phone_status);
    // app.globalData.phone_status = true;
    console.log(app.globalData);
    this.setData({
      'phone_status': this.data.phone_status
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  chooseAddress: function () {
    wx.chooseLocation({
      success: function(res) {
        wx.showToast({
          title: res,
        })
      },
    })
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
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