// pages/orderConfirm/orderConfirm.js
//获取应用实例
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var qqMap = new QQMapWX({
  key: app.globalData.qqmap_key
});
// 订单创建时间
var create_time = Date.parse(new Date())/1000;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0,
    total_price: 0,
    distance_cal: 0,
    distance: 0,
    markers: [],
    commentObj: {
      isEditing: !1,
      text: "",
      placeholder: "物品描述或送件要求",
      delete: !1
    },
    tipObj: {
      isEditing: !1,
      text: "",
      placeholder: "物品描述或送件要求",
      delete: !1
    },
    covers:[],
    scale: 13,
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
    tip: {
      text: ""
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
    hasAddress: !1,
    qsjValue: '',
  },

  bindTimeChange: function (e) {
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
    // 当前城市信息
    qqMap.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: function (res) {
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
        
      },
      complete: function (res) {
        // if(wx.getStorageSync('toaddress_detail') == ''){
        //   wx.removeStorageSync('fromaddress_lat')
        //   wx.removeStorageSync('fromaddress_lng')
        // }
      }
    });
  },
  priceRules: function (){
    console.log(this)
    var basePrice = app.globalData.base_price;
    var distancePrice = 0;
    var distance = this.data.distance_cal; // 距离
    console.log(this.data.distance_cal)
    var weightPrice = 0;
    var weight = wx.getStorageSync('qsj_weight');
    var price = 0;
    // 距离费
    if (distance >= 0 && distance < 3) {
      distancePrice += distance
    } else {
      distancePrice += ((distance - 3) * 2 + 3)
    }
    // 重量费
    if (weight <= 5){
      weightPrice = 0;
    } else if (weight >=6  && weight < 10) {
      weightPrice += 6;
    } else {
      weightPrice += 10;
    }
    
    if (this.data.tip.text) {
      price = basePrice + distancePrice + weightPrice + parseInt(this.data.tip.text)
    } else {
      price = basePrice + distancePrice + weightPrice
    }
    this.setData({
      price: price,
      total_price: price
    })
    wx.showToast({
      title: '两个经纬度之间的距离（米）' + this.data.distance+'   基础费： ' + 6 + '  距离费用 ： ' + distancePrice + '   重量费用 ： ' + weightPrice,
      icon: 'none',
      duration: 6000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    // 获取当前位置
    var latitude = '', longitude = '';
    var covers = that.data.covers;
    var markers = [];
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

      var from_lat = wx.getStorageSync('fromaddress_lat');
      var from_lng = wx.getStorageSync('fromaddress_lng');
      var to_lat = wx.getStorageSync('toaddress_lat');
      var to_lng = wx.getStorageSync('toaddress_lng');
      console.log('from_lat : ' + from_lat)
      console.log('from_lng : ' + from_lng)
      console.log('to_lat : ' + to_lat)
      console.log('to_lng : ' + to_lng)
      // 调用接口
      qqMap.calculateDistance({
        mode: 'driving', //步行，驾车为'driving'  walking'; , { latitude: blat,      longitude: blon    } 
        from: {
          latitude: from_lat,
          longitude: from_lng
        },
        to: [{
          latitude: to_lat,
          longitude: to_lng
        }],
        success: function (res) {
          if (res.message == "query ok") {

            var distance = res.result.elements["0"].distance;
            console.log('distance1 : ' + distance)
            var beishu = distance / 1000;
            that.setData({
              'distance': beishu,
              '_distance': beishu.toFixed(1),
              'distance_cal': parseInt(beishu)
            })
            var scale = that.data.scale;
            if (beishu > 100 && beishu <= 1000) {
              scale = 3
            } else if (beishu > 30 && beishu <= 100) {
              scale = 5
            } else if (beishu > 20 && beishu <= 30) {
              scale = 7
            } else if (beishu > 10 && beishu <= 20) {
              scale = 10
            } else {
              scale = 15
            }
            that.setData({
              scale: scale
            })
            that.priceRules() 
            console.log('success执行了')
            // that.priceRules(that);
            // console.log(that.data);
            // console.log(JSON.stringify(that.data));
            // that.setScale(res.result.elements["0"].distance);
          }
        },
        fail: function (res) {
          // console.log(res);
        },
        complete: function (res) {
          console.log('complete执行了')
          // console.log(that.data);
          // that.priceRules(that);
          // console.log(JSON.stringify(that.data));
        }
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

    wx.getLocation({
      type: 'gcj02',
      success(res) {
          that.localLocation(wx.getStorageSync('fromaddress_lat') || res.latitude, wx.getStorageSync('fromaddress_lng') || res.longitude);
      },
      fail(res) {
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
                    // console.log(res)

                  },
                  fail: function (res) {
                    // console.log(res)
                  }
                })
              }
            }
          })
        }
      },
      complete(res) {
        // console.log('---------定位结束----------')
        // console.log(res)
      }
    })

    // 取送件内容
    if (wx.getStorageSync('qsj') != '') {
      that.setData({
        qsjValue: wx.getStorageSync('qsj')
      })
    }
    
  },

setScale: function(distance){
  // distance = 704340;

  var beishu = distance/1000;
  this.setData({
    'distance': beishu,
    '_distance': beishu.toFixed(1),
    'distance_cal': parseInt(beishu)
  })
  var scale = this.data.scale;
  if (beishu>100 && beishu<=1000){
    scale = 3
  } else if (beishu > 30 && beishu <= 100) {
    scale = 5
  } else if (beishu > 20 && beishu <= 30) {
    scale = 7
  } else if (beishu > 10 && beishu <= 20) {
    scale = 10
  } else {
    scale = 15
  }
  this.setData({
    scale: scale
  })
}, 
  fromAddress: function () {
    let that = this;
  
    wx.chooseAddress({
      success: res => {
        console.log('ok');
        wx.setStorageSync('fromaddress_detail', JSON.stringify(res));
        qqMap.geocoder({
          address: res.cityName + res.countryName + res.detailInfo,
          success: function (qq_res) {
            if (qq_res.message == 'query ok') {
              wx.setStorageSync('fromaddress_lat', qq_res.result.location.lat);
              wx.setStorageSync('fromaddress_lng', qq_res.result.location.lng);

              var markers = that.data.markers;
              if(that.data.markers[0]){
                that.data.markers[0].latitude = qq_res.result.location.lat;
                that.data.markers[0].longitude = qq_res.result.location.lng;
              }

              var from_lat = wx.getStorageSync('fromaddress_lat');
              var from_lng = wx.getStorageSync('fromaddress_lng');
              var to_lat = wx.getStorageSync('toaddress_lat');
              var to_lng = wx.getStorageSync('toaddress_lng');
              // 调用接口
              qqMap.calculateDistance({
                mode: 'walking', //步行，驾车为'driving'  walking'; , { latitude: blat,      longitude: blon    } 
                from: {
                  latitude: from_lat,
                  longitude: from_lng
                },
                to: [{
                  latitude: to_lat,
                  longitude: to_lng
                }],
                success: function (res) {
                  if (res.message == "query ok"){

                    var distance = res.result.elements["0"].distance;
                    var beishu = distance / 1000;
                    that.setData({
                      'distance': beishu,
                      '_distance': beishu.toFixed(1),
                      'distance_cal': parseInt(beishu)
                    })
                    var scale = that.data.scale;
                    if (beishu > 100 && beishu <= 1000) {
                      scale = 3
                    } else if (beishu > 30 && beishu <= 100) {
                      scale = 5
                    } else if (beishu > 20 && beishu <= 30) {
                      scale = 7
                    } else if (beishu > 10 && beishu <= 20) {
                      scale = 10
                    } else {
                      scale = 15
                    }
                    that.setData({
                      scale: scale
                    })

                    that.priceRules()



                    // that.setScale(res.result.elements["0"].distance);
                  }
                },
                fail: function (res) {
                  // console.log(res);
                },
                complete: function (res) {
                  // console.log(res);
                }
              });

              that.setData({
                mapData: {
                  lng: qq_res.result.location.lng,
                  lat: qq_res.result.location.lat,
                },
                addressHide: false,
                addressDetail: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
                addressUser: res.userName + '  ' + res.telNumber,
                markers: markers
              })
            }
            console.log(that)
          },
          fail: function (res) {
            console.log(that)
            // console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });
      },
      fail: function(res){
        console.log(that)
      }
    })

  },

  toAddress: function () {
    let that = this;
    wx.chooseAddress({
      success: res => {
        wx.setStorageSync('toaddress_detail', JSON.stringify(res));
        qqMap.geocoder({
          address: res.cityName + res.countryName + res.detailInfo,
          success: function (qq_res) {
            if (qq_res.message == 'query ok') {
              var markers = that.data.markers;
              if (that.data.markers[1]) {
                that.data.markers[1].latitude = qq_res.result.location.lat;
                that.data.markers[1].longitude = qq_res.result.location.lng;
              }

              wx.setStorageSync('toaddress_lat', qq_res.result.location.lat);
              wx.setStorageSync('toaddress_lng', qq_res.result.location.lng);

              var from_lat = wx.getStorageSync('fromaddress_lat');
              var from_lng = wx.getStorageSync('fromaddress_lng');
              var to_lat = wx.getStorageSync('toaddress_lat');
              var to_lng = wx.getStorageSync('toaddress_lng');
              // 调用接口
              qqMap.calculateDistance({
                mode: 'walking', //步行，驾车为'driving'  walking'; , { latitude: blat,      longitude: blon    } 
                from: {
                  latitude: from_lat,
                  longitude: from_lng
                },
                to: [{
                  latitude: to_lat,
                  longitude: to_lng
                }],
                success: function (res) {
                  if (res.message == "query ok") {


                    var distance = res.result.elements["0"].distance;
                    var beishu = distance / 1000;
                    that.setData({
                      'distance': beishu,
                      '_distance': beishu.toFixed(1),
                      'distance_cal': parseInt(beishu)
                    })
                    var scale = that.data.scale;
                    if (beishu > 100 && beishu <= 1000) {
                      scale = 3
                    } else if (beishu > 30 && beishu <= 100) {
                      scale = 5
                    } else if (beishu > 20 && beishu <= 30) {
                      scale = 7
                    } else if (beishu > 10 && beishu <= 20) {
                      scale = 10
                    } else {
                      scale = 15
                    }
                    that.setData({
                      scale: scale
                    })

                    that.priceRules()



                    // that.setScale(res.result.elements["0"].distance);
                  }
                },
                fail: function (res) {
                  // console.log(res);
                },
                complete: function (res) {
                  // console.log(res);
                }
              });
              that.setData({
                addressHide: false,
                addressDetailTo: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
                addressUserTo: res.userName + '  ' + res.telNumber,
                markers: markers
              })
              
            }
          }
        });
        // that.setData({
        //   addressHideTo: false,
        //   addressDetailTo: res.detailInfo.length > 19 ? res.detailInfo.slice(0, 17) + '...' : res.detailInfo,
        //   addressUserTo: res.userName + '  ' + res.telNumber,
        // })
      }
    })
  },
  clickComment: function (e) {
    this.setData({
      "commentObj.isEditing": !0
    });
  },
  inputBlur: function (e) {
    this.data.commentObj.delete ? this.setData({
      "commentObj.delete": !1,
      "commentObj.text": "",
      "commentObj.isEditing": !1
    }) : this.setData({
      "commentObj.isEditing": !1,
      "commentObj.text": e.detail.value
    });
  },
  deleteRemark: function (e) {
    this.setData({
      "commentObj.delete": !0
    });
  },

  clickComment1: function (e) {
    this.setData({
      "tip.isEditing": !0
    });
  },
  inputBlur1: function (e) {
    var tipPrice = e.detail.value
    if (tipPrice == ""){
      tipPrice = 0;
    } else {
      tipPrice = parseInt(tipPrice)
    }

    this.data.tip.delete ? this.setData({
      "tip.delete": !1,
      "tip.text": "",
      "tip.isEditing": !1,
      "price": this.data.total_price
    }) : this.setData({
      "tip.isEditing": !1,
      "tip.text": e.detail.value,
      "price": this.data.total_price + tipPrice
    });
  },
  deleteRemark1: function (e) {
    this.setData({
      "tip.delete": !0,
    });
  },

  // 提交订单
  submitTip: function (e) {
    
    var data = this.data;
    console.log(data);
    var param = {
      'uid': parseInt(wx.getStorageSync('user_id')),
      'type': 1,
      'detail_info': data.qsjValue,
      'base_price': app.globalData.base_price,
      'tip_price': data.tip.text || 0,
      'create_time': create_time,
      'from_address': data.addressDetail,
      'from_user': data.addressUser,
      'to_address': data.addressDetailTo,
      'to_user': data.addressUserTo,
      'remark': data.commentObj.text,
      'from_time': data.time || Date.parse(new Date()) / 1000
    };
    console.log(param)
    app.paotui.createOrder(param)
      .then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '下单成功',
            icon: 'success',
            success: res =>{
              setTimeout(function(){
                wx.redirectTo({
                  url: '../orderList/orderList?uid=' + wx.getStorageSync('user_id')
                })
              }, 3000);
            }
          })
        }
        console.log(res);
      })
      .catch(res => {
        console.log(res);
      })
  },

  chooseAddress: function (e) {
    wx.chooseAddress({
      success: function (res) {

      },
      fail: function (res) {
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
    this.onLoad();
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