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
    goodsTypes: null,
    selectedType: -1,
    isDisabled: 1,
    selectedName: "",
    defaultSelect: {},
    goodsWeight: 1,
    tagWidth: 99,
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
  chooseItem: function (e) {
    console.log(e)
    var t = e.target.dataset.value;
    console.log(e.target.dataset.value)
    if (t){
      this.setData({
      selectedType: e.target.dataset.value,
      isDisabled: 0
    })
    }
  },
  clickConfirmBtn: function (e) {
    console.log(this.data)
    if ('' !== this.data.selectedType.id) {
      console.log(this.data.goodsWeight)
      var goodsWeight = this.data.goodsWeight == 1 ? '小于5公斤' : this.data.goodsWeight+'公斤' ;
      var goodsId = this.data.selectedType.id;
      var goodsName = this.data.selectedType.text
      wx.setStorageSync('qsj', goodsName+'、'+goodsWeight);
      wx.setStorageSync('qsj_id', goodsId);
      wx.setStorageSync('qsj_name', goodsName);
      wx.setStorageSync('qsj_weight', this.data.goodsWeight);
      wx.navigateBack({
        
      })
    } else {
      wx.showToast({
        icon: "none",
        title: "请先选择物品类型"
      });
    }
    
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
            detail['id'] = res.data[i].id
            detail['text'] = res.data[i].name
            goodsTypes[i] = detail;
          }
        }

        that.setData({
          tagList: goodsTypes,
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
    console.log(this)
    this.setData({
      goodsWeight: wx.getStorageSync('qsj_weight') || 1,
      selectedType: { 'id': wx.getStorageSync('qsj_id'), 'text': wx.getStorageSync('qsj_name')},
      isDisabled: this.data.selectedType ? 0 : 1 
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