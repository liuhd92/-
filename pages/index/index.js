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
//获取手机号的状态
const phone_status = app.globalData.phone_status;

Page({
  data: {
    userStatus: false,
    phone_status: false,
    pageMode: "delivery",
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    addressHide: true,
    addressHideTo: true,
    addressDetail: '',
    addressDetailTo: '',
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
    currentData:0,
    qsjValue: '',

  },

  onTapUserIcon: function(e) {
    
    wx.navigateTo({
      url: '../personSet/personSet',
    })
  },

  getPhoneNumber: function(e) {
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      app.paotui.getPhoneNumber(e.detail.encryptedData, e.detail.iv, wx.getStorageSync('session_key'), wx.getStorageSync('openid'))
        .then(res => {
          console.log(res.user_id)
          console.log(res.phoneNumber)
          if (res.code == 0) {
            wx.setStorageSync('user_id', res.data.user_id);
            wx.setStorageSync('phone', res.data.phoneNumber);
            this.setData({
              phone_status: true
            })
            wx.navigateTo({
              url: '../personSet/personSet',
            })
          }
          console.log('手机号获取成功');
          console.log(res);
        })
        .catch(res => {
          console.log('手机号获取失败');
          console.log(res);
        })
    }

    
    
  },
  
  // getPhoneNumber: function(e) {
  //   getPhoneNumber(encryptedData, iv, session_key)
  //   .then(res => {
  //     console.log('手机号获取成功');
  //     console.log(res);
  //   })
  //   .catch(res => {
  //     console.log('手机号获取失败');
  //     console.log(res);
  //   })
  //   console.log(e)
  // },

  // 获取订单列表
  getOrderList: function(e){
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
  fromAddress: function () {
    let that = this;
    console.log('12345');
    wx.chooseAddress({
      success: res=>{
        console.log(res)
        wx.setStorageSync('fromaddress_detail', JSON.stringify(res));
        qqMap.geocoder({
          address: res.cityName + res.countryName + res.detailInfo,
          success: function (qq_res) {
            if (qq_res.message == 'query ok') {

              console.log(qq_res)
              wx.setStorageSync('fromaddress_lat', qq_res.result.location.lat);
              wx.setStorageSync('fromaddress_lng', qq_res.result.location.lng);
              that.setData({
                addressHide: false,
                addressDetail: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
                addressUser: res.userName + '  ' + res.telNumber,
              })

              wx.navigateBack({
                url: '../index/index',
              })
            }
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      }
    })
    
  },

  toAddress: function () {
    let that = this;
    wx.chooseAddress({
      success: res => {
        console.log(res)
        wx.setStorageSync('toaddress_detail', JSON.stringify(res));
        qqMap.geocoder({
          address: res.cityName + res.countryName + res.detailInfo,
          success: function (qq_res) {
            if (qq_res.message == 'query ok') {

              console.log(qq_res)
              wx.setStorageSync('toaddress_lat', qq_res.result.location.lat);
              wx.setStorageSync('toaddress_lng', qq_res.result.location.lng);
              that.setData({
                addressHide: false,
                addressDetailTo: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
                addressUserTo: res.userName + '  ' + res.telNumber,
              })
            }
          }
        });
        that.setData({
          addressHideTo: false,
          addressDetailTo: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
          addressUserTo: res.userName + '  ' + res.telNumber,
        })
      }
    })
  },

  jumpToOrder: function(e){
    if(e.data.currentData == 0){
      var url = '../orderConfirm/orderConfirm';
    }
    
    if((e.data.addressDetail && e.data.addressUser) && (e.data.addressDetailTo && e.data.addressUserTo) && (e.data.qsjValue)){
      wx.navigateTo({
        url: url,
      })
      console.log(this.data.currentData)
    }
    // console.log(e)
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    this.onLoad()
    const that = this;
    // console.log(that.data.currentData)
    console.log(e.target.dataset.current)
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
    }), "end" !== e.type || void 0 !== this.data.sendAddress.id && "buy" !==  this.data.pageMode// || //this.getCenterLocation();
  },

  onShow: function(){
    this.getOrderList();
    this.onLoad();
  },

  onTapCity: function(){
    wx.navigateTo({
      url: '../cityList/cityList',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onShow: function(){
    let that = this;
    this.onLoad();
  },

  /**
   * 地址逆解析
   */
  localLocation: function(lat, lng){
    let that = this;
    
    console.log('----------localLocation----------');
    
    // 当前城市信息
    qqMap.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: function (res) {
        console.log(res)
        // 设置当前城市
        that.setData({
          myCity: res.result.address_component.city,
          mapData: {
            lng: lng,
            lat: lat
          }
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // if(wx.getStorageSync('toaddress_detail') == ''){
        //   wx.removeStorageSync('fromaddress_lat')
        //   wx.removeStorageSync('fromaddress_lng')
        // }
      }
    });
  },

  onLoad: function (e) {
    this.getOrderList()
    if(login_status != 'success'){
      this.setData({'userStatus': false});
    } else {
      this.setData({'userStatus': true});
    }
    var that = this;
    // 获取当前位置
    var latitude = '', longitude = '';

    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log('----------定位成功----------');
        console.log(res)
        console.log(that)
        if (that.data.currentData == 0){
          that.localLocation(wx.getStorageSync('fromaddress_lat') || res.latitude, wx.getStorageSync('fromaddress_lng') || res.longitude);
        } else {
          that.localLocation(res.latitude, res.longitude);
        }
      },
      fail(res) {
        console.log('---------定位失败----------');
        console.log(res)
        if (res.errMsg == 'getLocation:fail auth deny') {
          wx.showModal({
            title: '',
            content: '您尚未授权小程序获取地理位置 / 通讯地址，是否进入设置页面打开？',
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
                wx.showToast({
                  title: '点击了取消',
                })
              } else {
                // 打开设置页
                wx.openSetting({
                  success: function (res) {
                    console.log(res)
                    
                  },
                  fail: function (res) {
                    console.log(res)
                  }
                })
              }
            }
          })
        }
      },
      complete(res) {
        console.log('---------定位结束----------')
        console.log(res)
        that.jumpToOrder(that);
      }
    })

    
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
    // 取送件内容
    if (wx.getStorageSync('qsj')){
      that.setData({
        qsjValue: wx.getStorageSync('qsj')
      })
    }
  },

  locFormat: function (e) {
    if (Number.isNaN(e) || null === e || "null" === e || void 0 === e || "undefined" === e) return 0;
    var t = Math.abs(e);
    return 0 <= t && t <= 180 ? Math.round(1e6 * e) : Math.round(e);
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
      },
      fail: function(res){
        
        console.log(res)
        if (res.errMsg == 'chooseAddress:fail auth deny'){
          wx.showModal({
            title: '',
            content: '您尚未授权小程序获取地理位置 / 通讯地址信息，是否进入设置页面打开？',
            success: function (res) {
              if (res.cancel) {
                //点击取消,默认隐藏弹框
                wx.showToast({
                  title: '点击了取消',
                })
              } else {
                // 打开设置页
                wx.openSetting({
                  success: function (res) {

                  },
                  fail: function (res) {

                  }
                })
              }
            }
          })
        }
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
