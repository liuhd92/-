// pages/orderConfirm/orderConfirm.js
//获取应用实例
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var qqMap = new QQMapWX({
  key: app.globalData.qqmap_key
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [
      
    ],
    covers:[],
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
    mapData: {
      scale: 16,
      markers: [],
      lng: 116.29845,
      lat: 39.95933
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

  localLocation: function (lat, lng) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取当前位置
    var latitude = '', longitude = '';
    var covers = that.data.covers;
    var markers = that.data.markers;
    var fromaddress = wx.getStorageSync('fromaddress_detail');
    if (fromaddress != '') {
      fromaddress = JSON.parse(fromaddress);
      // covers.push({
      //   'latitude': wx.getStorageSync('fromaddress_lat'),
      //   'longitude': wx.getStorageSync('fromaddress_lng'),
      //   'iconPath': "/imgs/send.png",
      //   'width': 35,
      //   'height': 40
      // });

      markers.push({
        'id': 1,
        'latitude': wx.getStorageSync('fromaddress_lat'),
        'longitude': wx.getStorageSync('fromaddress_lng'),
        'iconPath': "/imgs/send.png",
        'width': 35,
        'height': 40
      });

      that.setData({
        addressHide: false,
        addressDetail: fromaddress.detailInfo.length > 19 ? fromaddress.detailInfo.slice(0, 17) + '...' : fromaddress.detailInfo,
        addressUser: fromaddress.userName + '  ' + fromaddress.telNumber,
        // covers: covers,
        markers: markers
      })
    }
    var toaddress = wx.getStorageSync('toaddress_detail');
    if (toaddress != '') {
      toaddress = JSON.parse(toaddress);
      markers.push({
        'id': 2,
        'latitude': wx.getStorageSync('toaddress_lat'),
        'longitude': wx.getStorageSync('toaddress_lng'),
        'iconPath': "/imgs/receive.png",
        'width': 35,
        'height': 40
      });
      that.setData({
        addressHide: false,
        addressDetailTo: toaddress.detailInfo.length > 19 ? toaddress.detailInfo.slice(0, 17) + '...' : toaddress.detailInfo,
        addressUserTo: toaddress.userName + '  ' + toaddress.telNumber,
        markers: markers
      })
    }
    console.log(that.data)



    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log('----------定位成功----------');
          that.localLocation(wx.getStorageSync('fromaddress_lat') || res.latitude, wx.getStorageSync('fromaddress_lng') || res.longitude);
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
      }
    })

    // 取送件内容
    if (wx.getStorageSync('qsj')) {
      that.setData({
        qsjValue: wx.getStorageSync('qsj')
      })
    }
  },

  fromAddress: function () {
    let that = this;
    wx.chooseAddress({
      success: res => {
        console.log(res)
        wx.setStorageSync('fromaddress_detail', JSON.stringify(res));
        qqMap.geocoder({
          address: res.cityName + res.countryName + res.detailInfo,
          success: function (qq_res) {
            if (qq_res.message == 'query ok') {
              wx.setStorageSync('fromaddress_lat', qq_res.result.location.lat);
              wx.setStorageSync('fromaddress_lng', qq_res.result.location.lng);
              console.log(that.data);
              console.log(that.data.markers[0])
              console.log(that.data.markers[0].latitude)
              console.log(that.data.markers[0].longitude)
              console.log(qq_res.result.location.lat)
              console.log(qq_res.result.location.lng)
              if(that.data.markers[0]){
                that.data.markers[0].latitude = qq_res.result.location.lat;
                that.data.markers[0].longitude = qq_res.result.location.lng;
              }

              console.log(that.data);
              that.setData({
                mapData: {
                  lng: qq_res.result.location.lng,
                  lat: qq_res.result.location.lat,
                },
                addressHide: false,
                addressDetail: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
                addressUser: res.userName + '  ' + res.telNumber,
                // markers
              })
              console.log(that)
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
                addressDetail: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
                addressUser: res.userName + '  ' + res.telNumber,
                covers: covers,
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

  chooseAddress: function (e) {
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
      fail: function (res) {

        console.log(res)
        if (res.errMsg == 'chooseAddress:fail auth deny') {
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
    var pages = getCurrentPages();
    var lastpage = pages[pages.length-2];
    lastpage.setData({
      'addressDetail': '',
      'addressUser': '',
      'addressDetailTo': '',
      'addressUserTo': '',
    })
    wx.removeStorageSync('fromaddress_detail');
    wx.removeStorageSync('fromaddress_lat');
    wx.removeStorageSync('fromaddress_lng');
    wx.removeStorageSync('toaddress_detail');
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