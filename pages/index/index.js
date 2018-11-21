//index.js
//获取应用实例
const app = getApp();
//用户登陆状态
const login_status = app.globalData.login_status;

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    mapData: {
      scale: 16,
      markers: [],
      lng: 116.29845,
      lat: 39.95933
    },
    sendAddress:{},
    ongoingOrderIds:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // 取送件代购切换
    currentData:0

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //获取当前取件代购的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  onMapRegionChange: function (e) {//点击地图
    "end" !== e.type && this.data.pinTextVisible && this.setData({
      pinTextVisible: !1
    }), "end" !== e.type || void 0 !== this.data.sendAddress.id && "buy" !==  this.data.pageMode || this.getCenterLocation();
  },
  getPhoneNumber: function(res){
    console.log(res)
  },
  onLoad: function () {
    // 获取当前位置
    var that=this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        console.log(latitude);
        console.log(longitude);
        that.setData({
          lat: res.latitude,
          lng: res.longitude
        })
      }
    })
    
    console.log('login_status : ' + login_status)
    
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 地图
  },

  chooseAddress: function(e){
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
