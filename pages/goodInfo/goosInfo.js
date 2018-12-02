// pages/goodInfo/goosInfo.js
//index.js
//获取应用实例
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var qqMap = new QQMapWX({
  key: app.globalData.qqmap_key
});
//用户登陆状态
const login_status = app.globalData.login_status;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedType: -1,
    selectedName: "",
    goodsTypes: null,
  },

  selectedGoodsType: function (e) {
    this.setData({
      selectedType: e.detail.id,
      selectedName: e.detail.text
    });
  },
  chooseWeight: function (e) {
    this.setData({
      goodsWeight: 4 === e.detail.value ? 1 : e.detail.value
    });
  },
  changeingWeight: function (e) {
    this.setData({
      goodsWeight: 4 === e.detail.value ? 1 : e.detail.value
    });
  },

  getGoodsList: function (e) {
    let that = this;
    app.paotui.getGoodsList(2)
      .then(res => {
        console.log('订单列表获取成功');
        console.log(res);
        console.log(res.code)
        var goodsTypes = [];
        if(res.code == 0){
          for(var i in res.data){
            var detail = {};
            detail['selectedType'] = res.data[i].id
            detail['selectedName'] = res.data[i].name
            // console.log(i)
            // console.log(res.data[i]);
            goodsTypes[i] = detail;
          }
        }

        that.setData({
          goodsTypes: goodsTypes,
          test: 123,
        })
          console.log(goodsTypes);
      })
      .catch(res => {
        console.log('订单列表获取失败');
        console.log(res);
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsList();
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