// pages/orderConfirm/orderConfirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '',
    time_style: 'margin-left:403rpx;',
    scrollTop: 0,
    tipObj: {
      hasBorderBtm: !0,
      title: "小费",
      text: "",
      placeholder: "加小费抢单更快哦",
      hasPlaceholder: !0
    },
    tipFee: 0,
    tipSlide: {
      show: !1,
      disableRight: !1,
      slideStatus: "hidden",
      tipTags: [{
        id: 0,
        text: "不加了"
      }, {
        id: 5,
        text: "¥ 5"
      }, {
        id: 10,
        text: "¥ 10"
      }, {
        id: 15,
        text: "¥ 15"
      }, {
        id: 20,
        text: "¥ 20"
      }, {
        id: 25,
        text: "¥ 25"
      }],
      tipfeeMax: 200,
      isConfirm: !1,
      hideType: 0
    },
    canPickTime: !0,
    timeObj: {
      hasBorderBtm: !1,
      title: "取件时间",
      text: "",
      placeholder: "立即取件",
      hasPlaceholder: !1
    },
    timeSlide: {
      show: !1,
      slideStatus: "hidden",
      isConfirm: !1,
      hideType: 0
    },
    pickupTime: 0,
    protocolSelect: !0,
    extraFeeReason: "附近呼叫骑手人数过多，配送费暂时上调4元",
    hasExtraFee: !1,
    deliveryFee: 0,
    bmPriceDetails: [],
    totalFee: 0,
    feeDetail: {
      show: !1,
      slideStatus: "hidden",
      sections: [],
      bottom: 95
    },
    specialOrderBtm: "",
    pricingCityId: 0,
    hideToBackend: !1,
    isPayFail: !1,
    showAgreementDialog: !1,
    formId: "",
    // previewData: i(),
    orderMap: {
      displayCover: !1,
      coverCallback: null,
      markers: [],
      latitude: 40.008268,
      longitude: 116.487501
    },
    containerStyle: "padding-bottom:" + (getApp().globalData.isIpx ? 176 : 130) + "rpx;",
    sendIcon: "/imgs/sendPoint.png",
    receiveIcon: "/imgs/receivePoint.png",
    hasAddress: !1
  },

  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)

    console.log(e.detail.value)
    this.setData({
      time: e.detail.value,
      time_style: 'margin-left:379rpx;'
    })
  },

  clickTime: function (e) {
    
    this.setData({
      "orderMap.displayCover": !0,
      "orderMap.coverCallback": this.clickTimeCancel.bind(this),
      "timeSlide.show": !0,
      "timeSlide.slideStatus": "visible",
      "timeSlide.hideType": 0
    });
    console.log(e);
  },
  timeConfirm: function (e) {
    this.setData({
      "timeSlide.isConfirm": !0
    });
  },
  setPickupTime: function (e) {
    var t = e.detail.timeStamp ? e.detail.timeStamp / 1e3 : 0;
    this.setData({
      "timeObj.text": e.detail.timeText,
      pickupTime: t
    }), this.deliveryPreview(), this.timeCancel(1);
  },
  clickTimeCancel: function (e) {
    this.timeCancel(2);
  },
  timeCancel: function (e) {
    this.setData({
      "orderMap.displayCover": !1,
      "orderMap.coverCallback": null,
      "timeSlide.show": !1,
      "timeSlide.slideStatus": "hidden",
      "timeSlide.isConfirm": !1,
      "timeSlide.hideType": e
    });
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